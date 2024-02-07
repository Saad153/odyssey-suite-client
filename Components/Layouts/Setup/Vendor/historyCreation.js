import { createHistoryFields, createHistoryCheck, createHistorySelect } from '/functions/historyChecks';
function createHistory(Representatives, oldRecord, data){
    let htmlString = '';

    htmlString=createHistorySelect(Representatives[0].records, oldRecord.accountRepresentatorId, data.accountRepresentatorId, 'Account Rep');
    htmlString=htmlString+createHistorySelect(Representatives[0].records, oldRecord.authorizedById, data.authorizedById, 'Authorized By');
    
    htmlString=htmlString+createHistoryCheck(oldRecord.types, data.types, 'Types');
    htmlString=htmlString+createHistoryCheck(oldRecord.operations, data.operations, 'Operations');
    
    oldRecord.name!=data.name?htmlString=htmlString + createHistoryFields(oldRecord.name, data.name, 'Name'):null
    oldRecord.person1!=data.person1?htmlString=htmlString + createHistoryFields(oldRecord.person1, data.person1, 'Person1'):null
    oldRecord.mobile1!=data.mobile1?htmlString=htmlString + createHistoryFields(oldRecord.mobile1, data.mobile1, 'Mobile 1'):null
    oldRecord.person2!=data.person2?htmlString=htmlString + createHistoryFields(oldRecord.person2, data.person2, 'Person 2'):null
    oldRecord.mobile2!=data.mobile2?htmlString=htmlString + createHistoryFields(oldRecord.mobile2, data.mobile2, 'Mobile 2'):null
    oldRecord.telephone1!=data.telephone1?htmlString=htmlString + createHistoryFields(oldRecord.telephone1, data.telephone1, 'Tel 1'):null
    oldRecord.telephone2!=data.telephone2?htmlString=htmlString + createHistoryFields(oldRecord.telephone2, data.telephone2, 'Tel 2'):null
    oldRecord.address1!=data.address1?htmlString=htmlString + createHistoryFields(oldRecord.address1, data.address1, 'Address 1'):null
    oldRecord.address2!=data.address2?htmlString=htmlString + createHistoryFields(oldRecord.address2, data.address2, 'Address 2'):null
    oldRecord.city!=data.city?htmlString=htmlString + createHistoryFields(oldRecord.city, data.city, 'City'):null
    oldRecord.zip!=data.zip?htmlString=htmlString + createHistoryFields(oldRecord.zip, data.zip, 'Zip'):null
    oldRecord.ntn!=data.ntn?htmlString=htmlString + createHistoryFields(oldRecord.ntn, data.ntn, 'NTN'):null
    oldRecord.strn!=data.strn?htmlString=htmlString + createHistoryFields(oldRecord.strn, data.strn, 'STRN'):null
    oldRecord.website!=data.website?htmlString=htmlString + createHistoryFields(oldRecord.website, data.website, 'Website'):null
    oldRecord.infoMail!=data.infoMail?htmlString=htmlString + createHistoryFields(oldRecord.infoMail, data.infoMail, 'Info Mail'):null
    oldRecord.accountsMail!=data.accountsMail?htmlString=htmlString + createHistoryFields(oldRecord.accountsMail, data.accountsMail, 'Accounts Mail'):null
    oldRecord.bank!=data.bank?htmlString=htmlString + createHistoryFields(oldRecord.bank, data.bank, 'Bank'):null
    oldRecord.branchName!=data.branchName?htmlString=htmlString + createHistoryFields(oldRecord.branchName, data.branchName, 'Branch Name'):null
    oldRecord.branchCode!=data.branchCode?htmlString=htmlString + createHistoryFields(oldRecord.branchCode, data.branchCode, 'Branch Code'):null
    oldRecord.accountNo!=data.accountNo?htmlString=htmlString + createHistoryFields(oldRecord.accountNo, data.accountNo, 'Accounts No.'):null
    oldRecord.iban!=data.iban?htmlString=htmlString + createHistoryFields(oldRecord.iban, data.iban, 'IBAN'):null
    oldRecord.swiftCode!=data.swiftCode?htmlString=htmlString + createHistoryFields(oldRecord.swiftCode, data.swiftCode, 'Swift Code'):null
    oldRecord.routingNo!=data.routingNo?htmlString=htmlString + createHistoryFields(oldRecord.routingNo, data.routingNo, 'Routing No.'):null
    oldRecord.ifscCode!=data.ifscCode?htmlString=htmlString + createHistoryFields(oldRecord.ifscCode, data.ifscCode, 'IFS Code'):null
    oldRecord.micrCode!=data.micrCode?htmlString=htmlString + createHistoryFields(oldRecord.micrCode, data.micrCode, 'MICR Code'):null

    return htmlString
}

export { createHistory }