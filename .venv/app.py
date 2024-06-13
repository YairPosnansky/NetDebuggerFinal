import datetime
from flask import Flask, jsonify, redirect, request, render_template, send_file , send_from_directory
from sniffer_db import sniffer_db
import sqlite3
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.backends import default_backend
from diagnostics import Diagnostics
from ysniffer import ysniffer
import os


current_dir = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__)

# Flask routes

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/tableList', methods=['GET'])
def get_table_list():
    tables = sniffer_db.get_tables()
    return jsonify(tables)

@app.route('/db', methods=['GET'])
def download_db_file():
    db_file = os.path.abspath(r".venv\sniff_history.db")
    print(db_file)
    return send_file(db_file, as_attachment=True)

@app.route('/table/<table_name>', methods=['GET'])
def get_table_contents(table_name):
    # Connect to the database
    conn = sqlite3.connect(sniffer_db.db_file)
    cursor = conn.cursor()

    # Query the table
    cursor.execute(f"SELECT * FROM {table_name}")
    table_data = cursor.fetchall()

    # Close the connection
    conn.close()

    return jsonify(table_data)

@app.route('/network_interfaces', methods=['GET'])
def get_network_interfaces():
    interfaces = ysniffer.get_network_interfaces()
    return jsonify(interfaces)

@app.route('/start_sniffer', methods=['POST'])
def start_sniffer():
    iface = request.json['iface']
    sniffer_db.start(iface)
    return jsonify({'status': 'success', 'message': 'Sniffer started'})

@app.route('/stop_sniffer', methods=['POST'])
def stop_sniffer():
    sniffer_db.stop()
    return jsonify({'status': 'success', 'message': 'Sniffer stopped'})

@app.route('/is_sniffer_running', methods=['GET'])
def is_sniffer_running():
    is_running = sniffer_db.is_running()
    return jsonify({'is_running': is_running})

@app.route('/arp_table', methods=['GET'])
def get_arp_table():
    arp_table = Diagnostics.get_arp_table()
    return jsonify(arp_table)

@app.route('/traceroute', methods=['POST'])
def traceroute():
    ip = request.json['ip']
    hops = Diagnostics.traceroute(ip)
    return jsonify(hops)

pdf_path = os.path.abspath(r'.venv\static\NetDebugger.pdf')

@app.route('/pdf', methods=['GET'])
def get_pdf():
    return send_from_directory(os.path.dirname(pdf_path), os.path.basename(pdf_path))

# Self-signed certificate generation

def generate_self_signed_cert():
    # Create a key pair
    key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )

    # Generate a self-signed certificate
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COMMON_NAME, "My Self-Signed Server"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "My Organization"),
        x509.NameAttribute(NameOID.ORGANIZATIONAL_UNIT_NAME, "My Unit"),
        x509.NameAttribute(NameOID.COUNTRY_NAME, "US"),
        x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "California"),
        x509.NameAttribute(NameOID.LOCALITY_NAME, "San Francisco"),
    ])

    cert = x509.CertificateBuilder().subject_name(
        subject
    ).issuer_name(
        issuer
    ).public_key(
        key.public_key()
    ).serial_number(
        x509.random_serial_number()
    ).not_valid_before(
        datetime.datetime.utcnow()
    ).not_valid_after(
        datetime.datetime.utcnow() + datetime.timedelta(days=365)
    ).sign(key, hashes.SHA256(), default_backend())

    # Save the certificate and private key
    with open("server.crt", "wb") as f:
        f.write(cert.public_bytes(serialization.Encoding.PEM))

    with open("server.key", "wb") as f:
        f.write(key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption(),
        ))

@app.before_request
def redirect_http_to_https():
    if request.url.startswith('http://'):
        url = request.url.replace('http://', 'https://', 1)
        code = 301
        return redirect(url, code=code)

if __name__ == '__main__':
    # Generate a self-signed certificate if it doesn't exist
    try:
        open("server.crt", "rb").close()
        open("server.key", "rb").close()
    except FileNotFoundError:
        generate_self_signed_cert()

    # Start the Flask server with SSL
    app.run(host='localhost', port=8000, ssl_context=('server.crt', 'server.key'))