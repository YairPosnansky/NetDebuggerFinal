import subprocess
import socket

class Diagnostics:
    @staticmethod
    def get_arp_table():
        arp_table = []
        
        # Get the local ARP table
        local_arp_output = subprocess.check_output(["arp", "-a"]).decode("utf-8")
        local_arp_lines = local_arp_output.split("\n")
        for line in local_arp_lines:
            if line.strip():
                arp_table.append(line.split())
        
        # Get the router ARP table
        try:
            router_ip = socket.gethostbyname("router")
            router_arp_output = subprocess.check_output(["ssh", router_ip, "arp", "-a"]).decode("utf-8")
            router_arp_lines = router_arp_output.split("\n")
            for line in router_arp_lines:
                if line.strip():
                    arp_table.append(line.split())
        except (socket.gaierror, subprocess.CalledProcessError):
            pass
        
        return arp_table
    
    @staticmethod
    def traceroute(ip):
        traceroute_output = subprocess.check_output(["tracert", "-d", ip]).decode("utf-8")
        traceroute_lines = traceroute_output.split("\n")
        
        hops = []
        for line in traceroute_lines:
            if line.startswith(" "):
                hop_info = line.split()
                if len(hop_info) >= 8:
                    hop = f"{hop_info[1]} {hop_info[2]} {hop_info[3]} {hop_info[4]} {hop_info[7]}"
                    hops.append(hop)
        
        return hops
    
def main():
    print("ARP Table:")
    arp_table = Diagnostics.get_arp_table()
    for entry in arp_table:
        print(" ".join(entry))
    
    print("\nTraceroute:")
    ip = input("Enter the IP address to traceroute: ")
    hops = Diagnostics.traceroute(ip)
    for hop in hops:
        print(hop)

if __name__ == "__main__":
    main()