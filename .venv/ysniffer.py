from packet_parser import packet_parser

from collections import Counter
from scapy.all import *
import io

class ysniffer:

  pck = ()

  def packet_callback(self,packet):
    captured_output = io.StringIO()
    print(packet.show(dump=True), file=captured_output)
    output = captured_output.getvalue()
    self.process_captured_output(output=output)

  # Create a function to handle the captured output
  def process_captured_output(self,output:str):
    if output.find('TCP') != -1:
      self.pck =  packet_parser.TCP(output.replace("\n", ""))
    elif output.find('UDP') != -1:
      self.pck =  packet_parser.UDP(output.replace("\n", ""))
    elif output.find('ARP') != -1:
      self.pck = packet_parser.ARP(output.replace("\n", ""))
    elif output.find('ICMP') != -1:
      self.pck = packet_parser.ICMP(output.replace("\n", ""))
    else:
       self.pck = ('Unsupported','Unsupported','Unsupported','Unsupported','Unsupported',output)
    pass


  def sniff(self, iface):
    sniff(count=1, filter=None,  iface=iface, prn=self.packet_callback)

  @staticmethod
  def get_network_interfaces():
    return [iface.name for iface in get_working_ifaces()]

  #GETPACKET#
  def get_pck(self):
    tmp_pck = self.pck
    self.pck = None
    return tmp_pck
  


if __name__ == '__main__':
  #"Unit Testing" ;)
  for i in range(80):
    sniffer = ysniffer()
    sniffer.sniff('Ethernet')
    pck = sniffer.get_pck()
    if pck != None:
      print(pck)