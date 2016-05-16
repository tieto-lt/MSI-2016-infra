drone_sid="ardrone2_128219"
wifi_sid="extOpenWrt"

nmcli d disconnect wlan0
nmcli d wifi connect $drone_sid ifname wlan0

echo "killall udhcpd; iwconfig ath0 mode managed essid $wifi_sid; ifconfig ath0 192.168.16.1 netmask 255.255.255.0 up;" | telnet 192.168.1.1

nmcli d disconnect wlan0
nmcli d wifi connect $wifi_sid ifname wlan0
