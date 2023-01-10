## Alias to find a string in a folder structure

* `alias ff='find . -name "*" -type f  -print0 | xargs -0 egrep --color=auto -i'`
* then you can use ff 'cnet.com|cnetcontentsolutions.com|cnetcontent.com'
or `ff cnet.*.com`


## Batch processing of files

Example: pretty-print all XML files in a folder and place beautified versions in a /formatted folder while keeping the original names

```
mkdir formatted; ls -1 *fr.xml | xargs -l bash -c 'xmllint --format $0 > formatted/$0.xml'
```

# JQ


## parent-child JSON into tabular format

```
[
        {
                "TargetProducts": [
            {
                "Pn": "7X10A0EJNA",
                "Category": "systems",
                "DisplayOrder": 3
            },
            {
                "Pn": "7X10A0ELNA",
                "Category": "systems",
                "DisplayOrder": 3
            }
        ],
        "Category": "services",
        "Pn": "5PS7A06899",
        "Title": "3 Year Premier Essential 24x7 4Hr + YDYD",
        "ImageUrl": "https://cdn.cs.1worldsync.com/syndication/feeds/lenovo/feed/A7/C/C/CC9ED56BA873435246383EC0121ACAE7DD989932_ISGPSESSENTIALLOGO_w_400_hero.png",
        "Specs": {
            "description": "Improve uptime for core business workloads and safeguard sensitive data. The Essential support level includes all the benefits of Foundation services, plus 4-hour onsite response, 24 hours per day, 7 days per week.  Lenovo Premier Support service provides a new level of support for the data center. Premier Support knows the challenges you're facing, and it will provide the expertise, the convenience and the dedication to help take the complexity out of today's demanding data center environments."
        }
    }
]
```

into 

```
('10MR000DUS','4X20E53336'),
('10MR000ECA','4X20E53336'),
('10MR000EUS','4X20E53336'),
('10MR000FCA','4X20E53336'),
```

using `$reco` to hold parent:

```
jq -r  '.[] | . as $reco |
        .TargetProducts[] |
        [ .Pn, $reco.Pn]  |
        @tsv' cross_sell_content_lenovo_recommends_*.json |
        awk -F '\t' -v OFS='\t' '{print "(\x27"$1"\x27,\x27"$2"\x27),"}' > recos.txt
```
