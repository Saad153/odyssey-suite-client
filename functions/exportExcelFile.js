const ExcelJS = require("exceljs");

export default function exportExcelFile(data, columns){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("My Sheet");
    sheet.properties.defaultRowHeight = 30;

    sheet.getRow(1).border = {
        top: { style: "thick", color: { argb: "black" } },
        left: { style: "thick", color: { argb: "black" } },
        bottom: { style: "thick", color: { argb: "black" } },
        right: { style: "thick", color: { argb: "black" } },
    };

    sheet.getRow(1).fill = {
        type: "pattern",
        pattern: "lightGray",
        // fgColor: { argb: "silver" },
    };

    sheet.getRow(1).font = {
        size: 14,
        bold: true,
    };
    sheet.columns = [...columns];

    const promise = Promise.all(
        data.map(async (product) => {
            const { SE_Job, ...restProduct } = product;
            const obj = {...SE_Job, ...restProduct};
            // console.log("obj",obj)
            sheet.addRow({
               ...obj
            });
        })
    );


    promise.then(() => {
        workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "download.xlsx";
        anchor.click();
        window.URL.revokeObjectURL(url);
        });
    });
};