var _ = LodashGS.load(); // 1SQ0PlSMwndIuOAgtVJdjxsuXueECtY9OGejVDS37ckSVbMll73EXf2PW

// Energy related attributes
DSATTR = { 
  DATE              : {url : "na", atype : "date", atid: null },
  CAT               : {url : "avu", atype : "category", atid: null },
  STATUS            : {url : "avu",atype : "status", atid: null },
  PRODTYPE          : {url : "avu",atype : "text", atid: [12244,12109,12012,3059,959,5858,3677,3620,3584,3559,1992,7450,3664,3646] }, 
  EPREL_RATING      : {url : "avu",atype : "text", atid: [6915,4739,3545,8315,5550]},
  EPREL_REGULATION  : {url : "avu",atype : "text", atid: [12280]},
  EPREL_LOGO_TYPE   : {url : "avu",atype : "text", atid: [12549]},
  EPREL_FICHE       : {url : "avu",atype : "text", atid: [12427]},
  PRODLINE          : {url : "avu",atype : "text", atid: [600]},
  PRODTYPEID        : {url : "avu",atype : "id", atid: [12244,12109,12012,3059,959,5858,3677,3620,3584,3559,1992,7450,3664,3646] },  
  HASLABEL          : {url : "contentcheck", atype : "node", path: "ccs-logos.available"},
  HASFICHE          : {url : "contentcheck", atype : "node", path: "ccs-product-fiche.available"}
}

const START_COL = 24
const SHEET_COLS = { 
  PN     : { pos : 8, map : null },
  MAN    : { pos : 9, map : null },
  GTIN   : { pos : 10, map : null },

  DATE     : { pos: START_COL, map: DSATTR.DATE},
  HASLABEL : { pos : START_COL+1, map: DSATTR.HASLABEL},
  HASFICHE : { pos : START_COL+2, map: DSATTR.HASFICHE},
  CAT    : { pos : START_COL+3, map: DSATTR.CAT },
  STATUS : { pos : START_COL+4, map: DSATTR.STATUS },
  TYPE   : { pos : START_COL+5, map: DSATTR.PRODTYPE },
  RATING : { pos : START_COL+6, map: DSATTR.EPREL_RATING },
  FICHE  : { pos : START_COL+7, map: DSATTR.EPREL_FICHE },
  ELTYPE : { pos : START_COL+8, map: DSATTR.EPREL_LOGO_TYPE},
  TYPE_ID : { pos : START_COL+9, map: DSATTR.PRODTYPEID}
}


const FIRST_UPDATED_COL = SHEET_COLS.DATE.pos
const LAST_UPDATED_COL = SHEET_COLS.TYPE_ID.pos

const START_AT = 16 ;
const END_AT = 19 ;
const DEBUG = false;


function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('1WS')
      .addItem('Refresh Energy Labels', 'refresh_el_rows_action')
      .addToUi();
}

//https://stackoverflow.com/questions/8817394/javascript-get-deep-value-from-object-by-passing-path-to-it-as-string
function recLookup(obj, path) {
    parts = path.split(".");
    if (parts.length==1){
        return obj[parts[0]];
    }
    return recLookup(obj[parts[0]], parts.slice(1).join("."));
}

function refresh_el_rows_action() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ADHOC")
  var range = sheet.getSelection().getActiveRange()
  var product_data = range.getValues();

  var target_range = sheet.getRange(range.getRow(),FIRST_UPDATED_COL, range.getNumRows(),LAST_UPDATED_COL-FIRST_UPDATED_COL+1)
  cell_update_data = update_with_logo_info(product_data)
  target_range.setValues(cell_update_data)
}


function update_with_logo_info(data)
{
  
  updated_data = []

  for (var i = 0; i < data.length; i++) {
    if(data[i] != null) 
    {
      //Logger.log(`at row ${i}: ${data[i][SHEET_COLS.PN.pos]} / ${data[i][SHEET_COLS.MAN.pos]} / ${data[i][SHEET_COLS.GTIN.pos]} => called`)
      p = new CCEnergyPage(data[i][SHEET_COLS.MAN.pos-1],data[i][SHEET_COLS.PN.pos-1],data[i][SHEET_COLS.GTIN.pos-1],'de',DEBUG)
      p.fetch().extract()
      vals = []
      for (const [col, value] of Object.entries(p.values)) {
        vals.push(value)
      }
    }
    updated_data.push(vals)
  }
  return updated_data
 
}

function test_entry_point ()
{
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName("ADHOC")
  var rangeA1Notation = `A${START_AT}:X${END_AT}`
  var range = sheet.getRange(rangeA1Notation);
  var product_data = range.getValues();

  var target_range = sheet.getRange(START_AT,FIRST_UPDATED_COL, END_AT-START_AT+1,LAST_UPDATED_COL-FIRST_UPDATED_COL+1)
  cell_update_data = update_with_logo_info(product_data)
  target_range.setValues(cell_update_data)
}


class CCEnergyPage {
  constructor(mf, pn, gtin, lang = 'de-de', debug=false) {
    this.mf = mf;
    this.pn = pn;
    this.gtin = gtin;
    this.lang = lang
    this.data = {}
    this.values = {}
  }

  get_avu_text(atr_ids)
  {
    var atr_value = null
    for(const atr_id of atr_ids)
    {
      try {
          atr_value = _.filter(this.data["tx-avus"]["avus"], [ "attr", atr_id])[0]["vals"][0]["name"]
          break
        } catch (e) {
        }
    } 
    //Logger.log(`... [${atr_id}] = ${atr_value} `)
    return atr_value
  }

  get_avu_id(atr_ids)
  {
    var atr_value = null
    for(const atr_id of atr_ids)
    {
      try {
          atr_value = _.filter(this.data["tx-avus"]["avus"], [ "attr", atr_id])[0]["vals"][0]["id"]
          break
        } catch (e) {
        }
    } 
    //Logger.log(`... [${atr_id}] = ${atr_value} `)
    return atr_value
  }

  get_avu_numerical_with_unit(atr_id)
  {
   value =  _.filter(this.data["tx-avus"]["avus"], [ "attr", atr_id ])[0]["vals"][0]["name"],
   unit =  _.filter(this.data["tx-avus"]["avus"], [ "attr", atr_id ])[0]["vals"][0]["unit"]["name"]
   return value + " " + unit
  }

  get_category()
  {
    var category = null
    try {
      category = this.data["tx-sku"]["category"]
      var z = "" + category

     } catch (e) {
     } 
    //Logger.log(`... [category] = ${category} `)
    return category  
  }

    get_status()
    {
      var status = null
      try {
        status = this.data["tx-sku"]["status"]
        var z = "" + status

      } catch (e) {
      } 
      return status  
    }
    
    get_node_value(path)
    {
      var node_value = "-"
      try {
        node_value = recLookup(this.data, path)
      } catch {}
      return node_value
    }
    

    get avu_url() {
        // uses Templex / AVUs hook
        var url = `https://ws.cs.1worldsync.com/4e284061/api/491d3447fb?mf=${encodeURIComponent(this.mf)}&pn=${encodeURIComponent(this.pn)}&upcean=${encodeURIComponent(this.gtin)}&lang=${this.lang}`;
        Logger.log(`avu_url:  ${url}`)
        return url
    }

      get energy_contentcheck_url() 
      {
        // uses Templex / EnergyLabel hook
        var url = `https://ws.cs.1worldsync.com/8f2083ee/contentcheck/f1f9e3985d?mf=${encodeURIComponent(this.mf)}&pn=${encodeURIComponent(this.pn)}&upcean=${encodeURIComponent(this.gtin)}&lang=${this.lang}`
        Logger.log(`energy_contentcheck_url:  ${url}`)
        return url
      }


    fetch() {
      // there might be several API calls to make to get data for this product, let's work on those separately:

      const url_types = _.sortedUniq(Object.keys(DSATTR).map(function getcall(ct) { return DSATTR[ct]["url"] }));

      for(const url_type of url_types)
      {
        switch(url_type) {
          case "contentcheck":
            var response = UrlFetchApp.fetch(this.energy_contentcheck_url).getContentText();
            _.merge(this.data,JSON.parse(response).data);
            break;
          case "avu":
            var response = UrlFetchApp.fetch(this.avu_url).getContentText();
            _.merge(this.data,JSON.parse(response).data);
            break;
          case "na":
            break;
          default:
            throw `Unsupported url_type ${url_type}`
        }
        //Logger.log(this.data);
      }   
      return this
    }

    extract() {
      var attributes_to_extract =  _.filter(SHEET_COLS, function(o) { return o.map != null; })
      for(const x of attributes_to_extract)
      {
          this.values[x.pos-1] = this.value_for(x.map)
      }
      return this   
    }

    value_for(map) {
        switch(map.atype) {
            case "text" : return this.get_avu_text(map.atid)
            case "id" : return this.get_avu_id(map.atid)
            case "category" : return this.get_category()
            case "status" : return this.get_status()
            case "node" : return this.get_node_value(map.path)
            case "date" : return new Date().toLocaleDateString()
            default: throw `undefined atype ${map.atype}`
        }
      }
}
