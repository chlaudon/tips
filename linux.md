## Alias to find a string in a folder structure

* `alias ff='find . -name "*" -type f  -print0 | xargs -0 egrep --color=auto -i'`
* then you can use ff 'cnet.com|cnetcontentsolutions.com|cnetcontent.com'
or `ff cnet.*.com`
