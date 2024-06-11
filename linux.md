## Alias to find a string in a folder structure

* `alias ff='find . -name "*" -type f  -print0 | xargs -0 egrep --color=auto -i'`
* then you can use ff 'cnet.com|cnetcontentsolutions.com|cnetcontent.com'
or `ff cnet.*.com`


## Batch processing of files

Example: pretty-print all XML files in a folder and place beautified versions in a /formatted folder while keeping the original names

```
mkdir formatted; ls -1 *fr.xml | xargs -l bash -c 'xmllint --format $0 > formatted/$0.xml'
```
## Call URLs defined in a file

$ head list.txt
https://cdn.cs.1worldsync.com/73/B1/73B1686C-9F40-4768-8D1F-BA5BE1466167.jpg
https://cdn.cs.1worldsync.com/7A/59/7A59D591-2523-4824-99EE-B543BF5142E1.jpg
https://cdn.cs.1worldsync.com/CD/3C/CD3C2826-6D64-4611-A37C-A1D53617AD3F.jpg
https://cdn.cs.1worldsync.com/88/01/88019163-91D3-46FE-A0D9-92485D57400E.jpg
https://cdn.cs.1worldsync.com/82/FC/82FC5A03-B979-4250-9409-742E519EF010.jpg
https://cdn.cs.1worldsync.com/7D/8C/7D8C7B53-7DFF-492F-8884-7C5BD9068463.jpg
https://cdn.cs.1worldsync.com/9A/B0/9AB05D62-CBFB-4BCE-AE69-EFF33428182E.jpg
https://cdn.cs.1worldsync.com/A6/D8/A6D85B1F-4C0A-4884-8FCC-6B68F7495203.jpg
https://cdn.cs.1worldsync.com/13/19/1319E844-1A34-45B3-874A-9B028173A971.jpg
https://cdn.cs.1worldsync.com/C0/81/C08148E3-748C-4E63-B219-8FADE4DAB64E.jpg

catt list.txt | xargs -i curl -i -X POST "https://api.fastly.com/purge/{}" -H "Fastly-Key: -gx0w12QcBn_NbnCPGe0oFPIMPeTsG85" -H "fastly-soft-purge: 1" -H "Accept: application/json"


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

## Monitor CPU/mem over a long time


The following sar command will log memory usage (-r option) and CPU usage (-u option) to output file mem.log (-o option) at 60 second intervals.

sar -r -u -o mem.log 60 > /dev/null 2>&1

This file is binary and can only be decoded using the sar command:

CPU consumption: `sar -f mem.log | more`

Memory consumption (-r option): `sar -r -f mem.log | more`

