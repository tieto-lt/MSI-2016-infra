killall udhcpd; 
iwconfig ath0 mode managed essid extOpenWrt; 
ifconfig ath0 192.168.16.1 netmask 255.255.255.0 up;
