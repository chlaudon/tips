
# WSL
## WSL2 stops working

* `tasklist /svc /fi "imagename eq svchost.exe"`
* Look for `LxssManager`, get process ID
* Go to Windows task list, Details pane, find process and kill it

## Install Powerline fonts
https://logfetch.com/wsl2-install-powerline/

## Run app via CLI

Open anything from wsl terminal as if it was double clicked in windows, even opening current dir in explorer (i.e. `start .`)

```
alias start="powershell.exe /c start"
```

 
