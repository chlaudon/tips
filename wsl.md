
# WSL
## WSL2 stops working

* `tasklist /svc /fi "imagename eq svchost.exe"`
* Look for `LxssManager`, get process ID
* Go to Windows task list, Details pane, find process and kill it

OR, run Powershell in Admin mode

`Get-Service LxssManager | Restart-Service`

OR

In Powershell, `wsl --shutdown`

## Install Powerline fonts
https://logfetch.com/wsl2-install-powerline/

## Run app via CLI

Open anything from wsl terminal as if it was double clicked in windows, even opening current dir in explorer (i.e. `start .`)

```
alias start="powershell.exe /c start"
```

 
