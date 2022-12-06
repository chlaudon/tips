## Alias to find a string in a folder structure

* `alias ff='find . -name "*" -type f  -print0 | xargs -0 egrep --color=auto -i'`
* then you can use ff 'cnet.com|cnetcontentsolutions.com|cnetcontent.com'
or `ff cnet.*.com`


## Batch processing of files

Example: pretty-print all XML files in a folder and place beautified versions in a /formatted folder while keeping the original names

```
mkdir formatted; ls -1 *fr.xml | xargs -l bash -c 'xmllint --format $0 > formatted/$0.xml'
```
