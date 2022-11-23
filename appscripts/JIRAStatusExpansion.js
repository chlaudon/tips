
function getTicketStatus (statuses, ticket) {
  for(var si=0; si < statuses.length; si++)
    if(statuses[si][1] == ticket)
       return(statuses[si][1]+" ("+statuses[si][6]+")")
  
}

/*
  This function enriches lists of JIRA tickets with their status
  jira_compose_sheet => the sheet in which 1st col contains a list of tickets
  jira_status_sheet => sheet that contains the JIRA statuses (fetched using the JIRA() function)
  updates the 2nd col in jira_compose_sheet with enriched ticket info
*/
function main ()
{
  var JIRARegexp = /(\w*-\d*)/ig;

  var jira_compose_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('JIRACompose')
  var jira_compose_range  = jira_compose_sheet.getDataRange()
  var jira_compose_values = jira_compose_range.getValues();

  var jira_status_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('JIRAStatus')
  var jira_statuses = jira_status_sheet.getDataRange().getValues();

  let lastRow = jira_compose_sheet.getDataRange().getLastRow();
  for (let row = 2; row < lastRow; row++) {
    var ticket_list = jira_compose_values[row][0]
    var tickets = ticket_list.match(JIRARegexp);

    if(tickets != null) {
      var result = ""
      for (var ti=0; ti < tickets.length; ti++) {
        ticket = tickets[ti]
        status = getTicketStatus(jira_statuses,ticket)
        if(status != undefined)
          result = result + status + String.fromCharCode(10)
      }
      jira_compose_values[row][1] = result
    }
    
  }

  jira_compose_range.setValues(jira_compose_values)

}
