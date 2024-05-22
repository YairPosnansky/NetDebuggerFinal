import re

class packet_parser:
    @staticmethod
    def ARP(packet_string):
        # Define the regular expressions
        src_regex = r"src\s*=\s*(\w+:\w+:\w+:\w+:\w+:\w+)"
        dst_regex = r"dst\s*=\s*(\w+:\w+:\w+:\w+:\w+:\w+)"
        dst_ipv4_regex = r"pdst\s*=\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
        src_ipv4_regex = r"psrc\s*=\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
        load_regex = r"load\s*=\s*'([\w\\]+)'"

        # Extract the values using regex
        try:
            src = re.search(src_regex, packet_string).group(1)
        except AttributeError:
            src = "Unknown"

        try:
            dst = re.search(dst_regex, packet_string).group(1)
        except AttributeError:
            dst = "Unknown"

        try:
            psrc = re.search(src_ipv4_regex, packet_string).group(1)
        except AttributeError:
            psrc = "Unknown"

        try:
            pdst = re.search(dst_ipv4_regex, packet_string).group(1)
        except AttributeError:
            pdst = "Unknown"

        try:
            load = re.search(load_regex, packet_string).group(1)
        except AttributeError:
            load = "Unknown"

        return (psrc, pdst, src, dst, 'ARP', load)

    @staticmethod
    def ICMP(packet_string):
      # Define the regular expressions
      src_regex = r"src\s*=\s*(\w+:\w+:\w+:\w+:\w+:\w+)"
      dst_regex = r"dst\s*=\s*(\w+:\w+:\w+:\w+:\w+:\w+)"
      dst_ipv4_regex = r"dst\s*=\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
      src_ipv4_regex = r"src\s*=\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
      load_regex = r"load\s*=\s*'([\w\\]+)'"

      # Extract the values using regex
      try:
          src = re.search(src_regex, packet_string).group(1)
      except AttributeError:
          src = "Unknown"

      try:
          dst = re.search(dst_regex, packet_string).group(1)
      except AttributeError:
          dst = "Unknown"

      try:
          psrc = re.search(src_ipv4_regex, packet_string).group(1)
      except AttributeError:
          psrc = "Unknown"

      try:
          pdst = re.search(dst_ipv4_regex, packet_string).group(1)
      except AttributeError:
          pdst = "Unknown"

      try:
          load = re.search(load_regex, packet_string).group(1)
      except AttributeError:
          load = "Unknown"

      return (psrc, pdst, src, dst, 'ICMP', load)

    @staticmethod
    def TCP(packet_string):
      # Define the regular expressions
      src_regex = r"src\s*=\s*(\w+:\w+:\w+:\w+:\w+:\w+)"
      dst_regex = r"dst\s*=\s*(\w+:\w+:\w+:\w+:\w+:\w+)"
      dst_ipv4_regex = r"dst\s*=\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
      src_ipv4_regex = r"src\s*=\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
      load_regex = r"###\[ IP \]###(.*)"

      # Extract the values using regex
      try:
          src = re.search(src_regex, packet_string).group(1)
      except AttributeError:
          src = "Unknown"

      try:
          dst = re.search(dst_regex, packet_string).group(1)
      except AttributeError:
          dst = "Unknown"

      try:
          psrc = re.search(src_ipv4_regex, packet_string).group(1)
      except AttributeError:
          psrc = "Unknown"

      try:
          pdst = re.search(dst_ipv4_regex, packet_string).group(1)
      except AttributeError:
          pdst = "Unknown"

      try:
          load = re.search(load_regex, packet_string).group(1)
      except AttributeError:
          load = "Unknown"

      return (psrc, pdst, src, dst, 'TCP', load)
    
    @staticmethod
    def UDP(packet_string):
      # Define the regular expressions
      src_regex = r"src\s*=\s*(\w+:\w+:\w+:\w+:\w+:\w+)"
      dst_regex = r"dst\s*=\s*(\w+:\w+:\w+:\w+:\w+:\w+)"
      dst_ipv4_regex = r"dst\s*=\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
      src_ipv4_regex = r"src\s*=\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
      load_regex = r"###\[ IP \]###(.*)"

      # Extract the values using regex
      try:
          src = re.search(src_regex, packet_string).group(1)
      except AttributeError:
          src = "Unknown"

      try:
          dst = re.search(dst_regex, packet_string).group(1)
      except AttributeError:
          dst = "Unknown"

      try:
          psrc = re.search(src_ipv4_regex, packet_string).group(1)
      except AttributeError:
          psrc = "Unknown"

      try:
          pdst = re.search(dst_ipv4_regex, packet_string).group(1)
      except AttributeError:
          pdst = "Unknown"

      try:
          load = re.search(load_regex, packet_string).group(1)
      except AttributeError:
          load = "Unknown"

      return (psrc, pdst, src, dst, 'UDP', load)
