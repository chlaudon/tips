# diff two ZIP files

PS C:\Users\pmoreira> $zip1 = [IO.Compression.ZipFile]::OpenRead("C:\Users\pmoreira\Desktop\cap_za_en_xml_2429_202310051
05145.zip")
PS C:\Users\pmoreira> $zip2 = [IO.Compression.ZipFile]::OpenRead("C:\Users\pmoreira\Desktop\cap_za_en_xml_2429_202310061
00818.zip")
PS C:\Users\pmoreira> $names1 = $zip1.Entries.FullName
PS C:\Users\pmoreira> $names2 = $zip2.Entries.FullName
PS C:\Users\pmoreira> ($names1).count
6393
PS C:\Users\pmoreira> ($names2).count
1395
PS C:\Users\pmoreira> $counter = (diff $names1 $names2).count
PS C:\Users\pmoreira>
