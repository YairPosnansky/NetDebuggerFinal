from packet_parser import packet_parser

from collections import Counter
from scapy.all import *
import io

class ysniffer:

  pck = ()

#Unite
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


  def sniff(self):
    sniff(count=1, filter=None,  iface='Ethernet', prn=self.packet_callback)

#ARP#
  def packet_callback_arp(self,packet):
      captured_output = io.StringIO()
      print(packet.show(dump=True), file=captured_output)
      output = captured_output.getvalue()
      self.process_captured_output_arp(output=output)

  # Create a function to handle the captured output
  def process_captured_output_arp(self,output:str):
      self.pck =  packet_parser.ARP(output.replace("\n", ""))
      pass
      
  def sniff_arp(self):
    sniff(count=1, filter='arp',  iface='Ethernet', prn=self.packet_callback_arp)

    
#ICMP#
  def packet_callback_icmp(self,packet):
      captured_output = io.StringIO()
      print(packet.show(dump=True), file=captured_output)
      output = captured_output.getvalue()
      self.process_captured_output_icmp(output=output)

  # Create a function to handle the captured output
  def process_captured_output_icmp(self,output:str):
      self.pck =  packet_parser.ICMP(output.replace("\n", ""))
      pass
      
  def sniff_icmp(self):
    sniff(count=1, filter='icmp',  iface='Ethernet', prn=self.packet_callback_icmp)
#TCP#
  def packet_callback_tcp(self,packet):
      captured_output = io.StringIO()
      print(packet.show(dump=True), file=captured_output)
      output = captured_output.getvalue()
      self.process_captured_output_tcp(output=output)

  # Create a function to handle the captured output
  def process_captured_output_tcp(self,output:str):
      self.pck =  packet_parser.TCP(output.replace("\n", ""))
      pass
      
  def sniff_tcp(self):
    sniff(count=1, filter='tcp',  iface='Ethernet', prn=self.packet_callback_tcp)

#UDP#
  def packet_callback_udp(self,packet):
      captured_output = io.StringIO()
      print(packet.show(dump=True), file=captured_output)
      output = captured_output.getvalue()
      self.process_captured_output_udp(output=output)

  # Create a function to handle the captured output
  def process_captured_output_udp(self,output:str):
      self.pck =  packet_parser.TCP(output.replace("\n", ""))
      pass
      
  def sniff_udp(self):
    sniff(count=1, filter='udp',  iface='Ethernet', prn=self.packet_callback_udp)
  
  #GETPACKET#
  def get_pck(self):
    tmp_pck = self.pck
    self.pck = None
    return tmp_pck
  


if __name__ == '__main__':
  #"Unit Testing" ;)
  for i in range(80):
    sniffer = ysniffer()
    sniffer.sniff_udp()
    pck = sniffer.get_pck()
    if pck != None:
      print(pck)