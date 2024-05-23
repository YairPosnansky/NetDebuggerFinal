import sqlite3
import datetime
from ysniffer import ysniffer
import threading
from time import sleep

class sniffer_db:
    sniffer_running = False
    sniffer_thread = None
    db_file = r'.venv\\\\sniff_history.db'

    @staticmethod
    def start(iface):
        # Create a table
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        table_name = f"sniff_{timestamp}"
        sniffer_db.sniffer_running = True

        # Start the sniffer in a thread
        sniffer_db.sniffer_thread = threading.Thread(target=sniffer_db.sniffer_loop, args=(table_name, iface))
        sniffer_db.sniffer_thread.start()

    @staticmethod
    def sniffer_loop(table_name, iface):
        # Connect to the database
        conn = sqlite3.connect(sniffer_db.db_file)
        cursor = conn.cursor()

        # Create the table
        cursor.execute(f"""
            CREATE TABLE {table_name}
            (id INTEGER PRIMARY KEY AUTOINCREMENT,
             time TEXT,
             psrc TEXT,
             pdst TEXT,
             src TEXT,
             dst TEXT,
             protocol TEXT,
             load TEXT)
        """)

        while sniffer_db.sniffer_running:
            sniffer = ysniffer()
            sniffer.sniff(iface)

            # Parse the packet data
            psrc, pdst, src, dst, protocol, load = sniffer.pck

            # Insert 
            timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cursor.execute(f"""
                INSERT INTO {table_name}
                (time, psrc, pdst, src, dst, protocol, load)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (timestamp, psrc, pdst, src, dst, protocol, load))
            conn.commit()

        conn.close()

    @staticmethod
    def stop():
        sniffer_db.sniffer_running = False
        sniffer_db.sniffer_thread.join()

    @staticmethod
    def get_tables():
        # Connect to the database
        conn = sqlite3.connect(sniffer_db.db_file)
        cursor = conn.cursor()

        # Query for table names
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [table[0] for table in cursor.fetchall()]
        tables.remove('sqlite_sequence')

        # Close the connection
        conn.close()

        return tables

    @staticmethod
    def get_db():
        return sniffer_db.db_file
        #using self breaks this... no idea why avoid changes
    @staticmethod
    def is_running():
        return sniffer_db.sniffer_running

if __name__ == "__main__":
    tables = sniffer_db.get_tables()
    print(tables)

    # Get the database file name
    db_file = sniffer_db.get_db()
    print(db_file)
    sniffer_db.start('Ethernet')
    if input() == 'c':
        sniffer_db.stop()