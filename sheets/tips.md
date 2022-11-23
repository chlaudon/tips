# Google sheets

## Set style if cell different than one above

Useful when you want to partition a sheet that contains hierarchical information

Conditional formatting > Custom formula is

```
=((index(A:A,row(),1)=index(A:A,row()-1,1)))
```
