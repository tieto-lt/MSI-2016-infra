drone_sid="ardrone2_128219"
wifi_sid="extOpenWrt"

nmcli c down id $wifi_sid
nmcli c up $drone_sid

echo "killall udhcpd; iwconfig ath0 mode managed essid $wifi_sid; ifconfig ath0 192.168.16.1 netmask 255.255.255.0 up;" | telnet 192.168.1.1

nmcli c down $drone_sid
nmcli c up $wifi_sid
