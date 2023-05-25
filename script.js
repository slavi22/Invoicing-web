/*https://www.w3schools.com/howto/howto_js_tabs.asp*/
/*TAB CONTROL AND AUTOHEIGHT*/
function tabControl(evt, loadTab) {
    let i, tabControlButton, activeTab;
    //hide everything, could be used on load
    tabControlButton = document.getElementsByClassName("tab")
    for (i = 0; i < tabControlButton.length; i++) {
        tabControlButton[i].style.display = "none";
    }

    //hide the "active"(current) window
    activeTab = document.getElementsByClassName("active");
    for (i = 0; i < activeTab.length; i++) {
        activeTab[i].className = activeTab[i].className.replace(" active", "");
    }

    //show the tab i clicked on and make it "active"
    document.getElementById(loadTab).style.display = "grid";
    evt.currentTarget.className += " active";

}

function setAutoHeight(childToBeAdjusted) {
    let parentDivHeight = document.querySelector(".newInvoice").clientHeight;
    let adjust = document.querySelector(`.${childToBeAdjusted}`).clientHeight;
    if (adjust < parentDivHeight) {
        document.querySelector(`.${childToBeAdjusted}`).style.height = `${parentDivHeight}px`;
    }
    //set the height of new invoice tab
    if (childToBeAdjusted == "newInvoice") {
        document.querySelector(".newInvoice").style.height = `${parentDivHeight}px`;
    }
}


/*END TAB CONTROL AND AUTOHEIGHT*/
/*START OF INVOICES TAB*/

//EVENTS
//disable double clicking
document.addEventListener("mousedown", function (e) {
    if (e.detail > 1) {
        e.preventDefault();
    }
})

//add a selected class on the new invoice tab's datagrid's cells
//https://stackoverflow.com/questions/54216661/jquery-click-is-not-working-on-dynamically-added-table-tr-via-php
function dataGridCellClick(tableClass) {
    $(document).on("click", `.${tableClass} td`, function () { //event delegation in the middle
        $(".selected").each(function () {
            $(this).removeClass("selected")
        });
        $(this).addClass('selected');
    });
}


//FUNCTIONS
function colorCells(tableClass) {
    let table = document.querySelector(`.${tableClass}`)
    let td = table.getElementsByTagName("td");
    $(`.${tableClass} tr`).css("background-color", "");
    for (let i = 0; i < td.length; i++) {
        if (!td[i].classList.contains("selected")) {
            // console.log("no selected class");
            td[i].style.backgroundColor = "";
            td[i].style.color = "black";
        }
        else {
            // console.log("there is a selected class")
            td[i].style.backgroundColor = "rgb(0, 120, 215)"
            td[i].style.color = "white";

        }
    }
}


function invoicesGridAddSelectedClass() { //https://stackoverflow.com/questions/1359018/how-do-i-attach-events-to-dynamic-html-elements-with-jquery
    $("body").on("click", ".invoicesInDB tbody tr", function () {
        $('.selectedRow').each(function () {
            $(this).removeClass('selectedRow')
        });
        $(this).addClass('selectedRow');
        colorRow();
    })
}

function colorRow() {
    let table = document.querySelector(".invoicesInDB");
    let tr = table.getElementsByTagName("tr");
    for (let i = 0; i < tr.length; i++) {
        if (!tr[i].classList.contains("selectedRow")) {
            tr[i].style.backgroundColor = "";
            tr[i].style.color = "black";
        }
        else {
            tr[i].style.backgroundColor = "rgb(0, 120, 215)";
            tr[i].style.color = "white";
        }
    }

}

function loadInvoicesFromDB() {
    $.ajax({
        url: 'phpScript.php',
        type: "GET",
        data: { function: 'InvoicesDBOnLoad' },
        success: function (result) {
            $(".invoicesInDB tbody").empty();
            $(".selectedCellInfo tbody").empty();
            $(".invoicesInDB tbody").append(result);
        }
    });
}

let number = 0;
function cellClickNumberInvoices() {
    let id = number;
    $.ajax({
        url: 'phpScript.php',
        type: "POST",
        data: {
            function: "InvoicesViewInvoiceProuducts",
            invoiceNumber: id
        },
        success: function (res) {
            //alert(res)
            $(".selectedCellInfo tbody").empty();
            $(".selectedCellInfo tbody").append(res);
        }
    })
}

function clickedRowNumberInvoices() {
    let table = document.querySelector(".invoicesDataGridShowInvoices")
    let tr = table.getElementsByTagName("tr");
    for (let i = 1; i < tr.length; i++) {
        if (tr[i].classList.contains("selectedRow")) {
            number = tr[i].children[0].innerText;
        }
    }
}

/*END OF INVOICES TAB*/

/*START OF NEW INVOICE TAB*/

//FUNCTIONS
function newInvoicesTabOnLoad(isDisabled) {
    let groupBoxes = document.querySelectorAll(".groupBox fieldset");
    for (let items of groupBoxes) {
        items.disabled = isDisabled;
    }
    let buttons = document.querySelectorAll(".newInvoice button, input[type=checkbox]");
    for (let items of buttons) {
        items.disabled = isDisabled;
    }
    document.querySelector("#btnNewInvoice").disabled = false;
    document.querySelector("#btnDelInvoice").disabled = false;
    document.querySelector("#btnPrintPreview").disabled = false;
    document.querySelector("#btnDialog").disabled = false;
    document.querySelector("#invNumber").disabled = true;
    let firstRowButtons = document.querySelectorAll(".firstRowButtons button");
    for (let items of firstRowButtons) {
        items.disabled = false;
    }
    let secondRowButtons = document.querySelectorAll(".secondRowButtons button, input[type=text]");
    for (let items of secondRowButtons) {
        items.disabled = !isDisabled;
    }
    document.querySelector("#invNumber").disabled = true;
    document.querySelector("#txtBoxDanOsnova").disabled = true;
    document.querySelector("#txtBoxDDS").disabled = true;
    document.querySelector("#txtBoxSum").disabled = true;
    document.querySelector("#inputSearch").disabled = false;
    document.querySelector("#btnSearch").disabled = false;
}

let count = 0;
function newInvoiceButtonOnClick() {
    count++;
    if (count == 1) {
        //unlock controls
        newInvoicesTabOnLoad(false);
    }
}

function invoiceTabSaveButtonOnClick() {
    count++;
    if (count > 2) {
        count = 2;
    }
}

function cancelButtonOnClick() {
    count = 0;
    newInvoicesTabOnLoad(true)
}

function nextInvoiceNumber() {
    $.ajax({
        url: 'phpScript.php',
        type: "GET",
        data: { function: 'NextInvoiceNumber' },
        success: function (result) {
            result = Number(result) + 1;
            //alert(result);
            $("#invNumber").val(result);
        }
    });
}


let formattedDate = undefined;
let dealDate = undefined;
function dateFormat() {
    let date = document.getElementById("invDate").valueAsDate = new Date();
    let temp = new Date(date);
    temp.setDate(temp.getDate() - 2);
    document.getElementById("invDate").addEventListener("change", function () {
        date = this.value;
        temp = new Date(date);
        temp.setDate(temp.getDate() - 2);
        formattedDate = moment(date).format("DD.MM.YYYY");
        dealDate = temp;
        dealDate = moment(dealDate).format("DD.MM.YYYY");
    });
    formattedDate = moment(date).format("DD.MM.YYYY");
    dealDate = temp;
    dealDate = moment(dealDate).format("DD.MM.YYYY");
}

function ddsClickChangeValue() {
    let DDS20 = document.getElementById("DDS20");
    let DDS9 = document.getElementById("DDS9");
    let labelDDS = document.getElementById("labelDDS");
    let txtBoxDanOsnova = document.getElementById("txtBoxDanOsnova");
    let txtBoxDDS = document.getElementById("txtBoxDDS");
    let txtBoxSum = document.getElementById("txtBoxSum");
    if (DDS20.checked && txtBoxDanOsnova.value != "" && $(".addedProducts tr").length != 1) {
        labelDDS.innerText = DDS20.value;
        labelDDS.style.marginLeft = "0.6em";
        txtBoxDDS.value = (txtBoxDanOsnova.value * 0.2).toFixed(2)
        txtBoxSum.value = (parseFloat(txtBoxDanOsnova.value) + parseFloat(txtBoxDDS.value)).toFixed(2);
    }
    else if (DDS9.checked && txtBoxDanOsnova != "" && $(".addedProducts tr").length != 1) {
        labelDDS.innerText = DDS9.value;
        labelDDS.style.marginLeft = "0.6em";
        txtBoxDDS.value = (txtBoxDanOsnova.value * 0.09).toFixed(2)
        txtBoxSum.value = (parseFloat(txtBoxDanOsnova.value) + parseFloat(txtBoxDDS.value)).toFixed(2);
    }
    else if (DDS20.checked && txtBoxDanOsnova != "" && $(".addedProducts tr").length == 1) {
        labelDDS.innerText = DDS20.value;
        labelDDS.style.marginLeft = "0.6em";
    }
    else if (DDS9.checked && txtBoxDanOsnova != "" && $(".addedProducts tr").length == 1) {
        labelDDS.innerText = DDS9.value;
        labelDDS.style.marginLeft = "0.6em";
    }
    //on startup
    else if (DDS20.checked && txtBoxDanOsnova.value == "") {
        labelDDS.innerText = DDS20.value;
        labelDDS.style.marginLeft = "0.6em";
    }
}

function firmsComboBoxOnLoad() {
    $("#firmsComboBox").empty();
    $.ajax({
        url: 'phpScript.php',
        type: "GET",
        data: { function: 'FirmsComboBoxOnLoad' },
        success: function (result) {
            $("#firmsComboBox").append(result);
            $("#firmsComboBox").prop('selectedIndex', -1);
        }
    })
}

function clientsComboBoxOnLoad() {
    $("#clientsComboBox").empty();
    $.ajax({
        url: 'phpScript.php',
        type: "GET",
        data: { function: 'ClientsComboBoxOnLoad' },
        success: function (result) {
            $("#clientsComboBox").append(result);
            $("#clientsComboBox").prop('selectedIndex', -1);
        }
    })
}

function paymentMethodComboBoxOnLoad() {
    let comboBox = document.getElementById("paymentMethodComboBox");
    comboBox.selectedIndex = -1;
}


function disabledButtonsCursor() {
    let buttons = document.querySelectorAll("button");
    buttons.forEach(element => {
        if (element.disabled == true) {
            element.style.cursor = "not-allowed";
        }
        else {
            element.style.cursor = "pointer";
        }
    });
}

function productsComboBoxOnLoad() {
    $.ajax({
        url: 'phpScript.php',
        type: "GET",
        data: { function: 'ProductsComboBoxOnLoad' },
        success: function (result) {
            $("#productsComboBox").append(result);
            $("#productsComboBox").prop("selectedIndex", -1);
        }
    })
}

function addSelectedProductToGrid() {
    let selectedIndex = document.getElementById("productsComboBox").selectedIndex;
    $.ajax({
        url: 'phpScript.php',
        type: "POST",
        data: {
            function: "AddSelectedProductToGrid",
            selectedIndex: selectedIndex
        },
        success: function (result) {
            $(".addedProducts tbody").append(result);
            $(".addedProducts td:eq(1)").width("25%")
            totalTextBoxes();
        }
    })
}

function addDataToInvoiceProduct() {
    let lastInvProdID = 0;
    $.ajax({
        url: "phpScript.php",
        type: "GET",
        data: {
            function: "GetLastInvoiceProductID"
        },
        success: function (result) {
            let parsedJson = JSON.parse(result);
            lastInvProdID = Number(parsedJson[0].INVPRODID);
            $(".addedProducts tbody tr").each(function () {
                lastInvProdID++;
                $.ajax({
                    url: "phpScript.php",
                    type: "POST",
                    data: {
                        function: "AddDataToInvoiceProduct",
                        invProdID: lastInvProdID,
                        productQuantity: $(this).children("td").eq(3).text(),
                        invoiceID: $("#invNumber").val(),
                        productID: $(this).children("td").eq(0).text()
                    }
                })
            })
        }
    });
}


function addNewInvoiceToDB() {
    if (count == 2 && $(".addedProducts tr").length == 1) {
        alert("Please add products to the table!");
        return;
    }
    if (count == 2 && newInvoiceGroupBoxesValidated()) {
        $("#newInvoicePopup p").remove();
        document.getElementById("newInvoicePopup").style.display = "grid";
        let form = document.querySelector(".form");
        form.style.filter = "blur(10px)";
        form.style.pointerEvents = "none";
        let fakNo = document.getElementById("invNumber");
        let message = document.createElement("p");
        message.setAttribute("id", "msg")
        message.innerHTML = `Сигурни ли сте че искате да добавите <br>фактура № <u>${fakNo.value}</u> в базата данни?`;
        document.getElementById("warningMessage").append(message)
        let buttonSave = document.getElementById("btnSaveNewInvoicePopup")
        let buttonCancel = document.getElementById("btnCancelNewInvoicePopup");
        buttonSave.addEventListener("click", function (e) {
            e.stopImmediatePropagation(); //https://stackoverflow.com/questions/7822407/why-is-my-alert-showing-more-than-once
            $.ajax({
                url: 'phpScript.php',
                type: "POST",
                data: {
                    function: 'AddNewInvoiceToDb',
                    invoiceNumber: $("#invNumber").val(),
                    invoiceVATDate: formattedDate,
                    invoiceDealDate: dealDate,
                    invoiceSum: $("#txtBoxDanOsnova").val(),
                    invoiceVat: $("#txtBoxDDS").val(),
                    invoiceTotal: $("#txtBoxSum").val(),
                    invoiceVatPercent: $("#labelDDS").text(),
                    customerId: $("#customersComboBox").prop("selectedIndex"),
                    myFirmId: $("#firmsComboBox").prop("selectedIndex")
                },
                success: function () {
                    form.style.filter = "blur(0px)";
                    closePopupWindow("newInvoicePopup");
                    alert(`Invoice number ${$("#invNumber").val()} has been successfully added to the db!`);
                    $("#invNumber").val((parseInt($("#invNumber").val())) + 1);
                    $("#clientsComboBox").prop("selectedIndex", -1);
                    $("#firmsComboBox").prop("selectedIndex", -1);
                    $("#paymentMethodComboBox").prop("selectedIndex", -1);
                    $("#productsComboBox").prop("selectedIndex", -1);
                    $(".addedProducts tbody").empty();
                    $("#txtBoxDanOsnova").val("");
                    $("#txtBoxDDS").val("");
                    $("#txtBoxSum").val("");
                    txtBoxesSum = 0;
                    document.getElementById("invDate").valueAsDate = new Date();
                    emptyComboBoxAddPopup("clientsGroupBox");
                    emptyComboBoxAddPopup("firmsGroupBox");
                    emptyComboBoxAddPopup("paymentMethodGroupBox");
                    emptyComboBoxAddPopup("productsGroupBox");
                    toggleErrorPopup();
                }
            });
            addDataToInvoiceProduct();
            form.style.pointerEvents = "auto";
        });
        buttonCancel.addEventListener("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("newInvoicePopup")
        }, { once: true });
        document.getElementById("xButton").addEventListener("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("newInvoicePopup");
        }, { once: true });
    }
}


function buttonNextRow(tableClass) {
    let table = document.querySelector(`.${tableClass}`);
    let cell = table.getElementsByTagName("td");
    if ($(`.${tableClass} tr`).length != 1) {
        if ($(`.${tableClass}`).find(".foundText").length != 0) {
            $(`.${tableClass}`).find(".foundText").removeClass("foundText").css("background-color", "");
        }
        if ($(`.${tableClass}`).find('.selected').length == 0) {
            $(`.${tableClass} tr`).closest("tbody").children("tr:first").addClass("selected");
            $(".selected").css("background-color", "red")
        }
        else {
            if ($(`.${tableClass} td`).hasClass("selected")) {
                $(".selected").css({
                    "background-color": "",
                    "color": ""
                });
                $(".selected").removeClass("selected").closest('tr').next("tr").addClass("selected");
            }
            else {
                $(".selected").removeClass("selected").css("background-color", "").next("tr").addClass("selected");
                for (let i = 0; i < cell.length; i++) {
                    cell[i].style.backgroundColor = "";
                    cell[i].style.color = "black";
                }
            }
        }
        let selectedIndex = $(".selected").index();
        if (selectedIndex == -1) {
            $(`.${tableClass} tr:last`).addClass("selected");
        }
        $(".selected").css("background-color", "red")
    }
}

function buttonPreviousRow(tableClass) {
    let selectedIndex = $(".selected").index();
    let table = document.querySelector(`.${tableClass}`);
    let cell = table.getElementsByTagName("td");
    if ($(`.${tableClass} tr`).length != 1) {
        if ($(`.${tableClass}`).find(".foundText").length != 0) {
            $(`.${tableClass}`).find(".foundText").removeClass("foundText").css("background-color", "");
        }
        if ($(`.${tableClass}`).find('.selected').length == 0) {
            $(`.${tableClass} tr`).closest("tbody").children("tr:first").addClass("selected");
            $(".selected").css("background-color", "red")
        }
        else {
            if ($(`.${tableClass} td`).hasClass("selected")) {
                $(".selected").css({
                    "background-color": "",
                    "color": ""
                });
                $(".selected").removeClass("selected").closest('tr').prev("tr").addClass("selected");
            }
            else {
                if (selectedIndex == 1 || selectedIndex == 0) {
                    $(".selected").css({
                        "background-color": "",
                        "color": ""
                    });
                    $(".selected").removeClass("selected").closest('tbody').children("tr:first").addClass("selected");
                }
                else {
                    $(".selected").removeClass("selected").css("background-color", "").prev("tr").addClass("selected");
                    for (let i = 0; i < cell.length; i++) {
                        cell[i].style.backgroundColor = "";
                        cell[i].style.color = "black";
                    }
                }
            }
            $(".selected").css("background-color", "red")
        }
    }
}

function buttonFirstRow(tableClass) {
    if ($(`.${tableClass} tr`).length != 1) {
        if ($(`.${tableClass}`).find(".foundText").length != 0) {
            $(`.${tableClass}`).find(".foundText").removeClass("foundText").css("background-color", "");
        }
        if ($(`.${tableClass}`).find('.selected').length == 0) {
            $(`.${tableClass} tr`).eq(1).addClass("selected");
        }
        else {
            $(`.${tableClass}`).find('.selected').removeClass("selected").css({ "background-color": "", "color": "" });
            $(`.${tableClass} tr`).eq(1).addClass("selected");
        }
        $(".selected").css("background-color", "red");
    }
}

function buttonLastRow(tableClass) {
    if ($(`.${tableClass} tr`).length != 1) {
        if ($(`.${tableClass}`).find(".foundText").length != 0) {
            $(`.${tableClass}`).find(".foundText").removeClass("foundText").css("background-color", "");
        }
        if ($(`.${tableClass}`).find('.selected').length == 0) {
            $(`.${tableClass} tr:last`).addClass("selected");
        }
        else {
            $(`.${tableClass}`).find('.selected').removeClass("selected").css({ "background-color": "", "color": "" });
            $(`.${tableClass} tr:last`).addClass("selected");
        }
        $(".selected").css("background-color", "red");
    }
}

function closePopupWindow(popupWindowID) {
    $(`#${popupWindowID}`).css("display", "none");
}

//create a function that searches a product cell using the search box, and if it matches the entered value color all the cells that match

function searchBoxSearch(inputBoxId, tableClass) {
    let valueOfSearchBox = $(`#${inputBoxId}`).val()
    let table = document.querySelector(`.${tableClass}`)
    $(`.${table.className}`).find("tr").each(function () {
        $(this).find("td").eq(1).each(function () {
            if (this.innerText == valueOfSearchBox) {
                $(".selected").css("background-color", "").removeClass("selected");
                $(this).addClass("foundText").css({ "background-color": "green", "color": "" });
            }
        })
    })
}

//create a function that validates whether all group boxes have a selected value and if not maybe give them a pop-up to tell them they need to fill in the said combobox
function emptyComboBoxAddPopup(groupBoxClass) {
    let groupBoxSelectedIndex = $(`.${groupBoxClass} fieldset select`).prop("selectedIndex");
    if (groupBoxSelectedIndex == -1) {
        if (groupBoxClass == "productsGroupBox") {
            $(`.${groupBoxClass} fieldset`).css({ "display": "flex", "align-items": "flex-start", "flex-wrap": "wrap" });
            $(`.${groupBoxClass} fieldset select`).css({ "width": "94.14%" });
            $('<i class="popupError fa-solid fa-circle-exclamation" style="color: #ff0000;"><span class="popupErrorText">Моля изберете стойност</span></i>').insertBefore($(`.${groupBoxClass} button`)).css({ "display": "flex", "margin-left": "1em" });
        }
        else {
            $(`.${groupBoxClass} fieldset`).css({ "display": "flex" });
            $('<i class="popupError fa-solid fa-circle-exclamation" style="color: #ff0000;"><span class="popupErrorText">Моля изберете стойност</span></i>').appendTo($(`.${groupBoxClass} fieldset`)).css({ "display": "flex", "margin-left": "1em" });
        }
    }
    else {
        if (groupBoxClass == "productsGroupBox") {
            $(`.${groupBoxClass} fieldset`).find(".popupError").fadeOut(150, function () {
                $(this).remove();
                $(`.${groupBoxClass} fieldset select`).css({ "width": "100%" });
            });
        }
        else {
            $(`.${groupBoxClass} fieldset`).find(".popupError").fadeOut(150, function () {
                $(this).remove();
            });
        }
    }
}

function newInvoiceGroupBoxesValidated() {
    if (($("#clientsComboBox").prop("selectedIndex") || $("paymentMethodComboBox").prop("selectedIndex") || $("#firmsComboBox").prop("selectedIndex") || $("#productsComboBoxComboBox").prop("selectedIndex")) == -1) {
        alert("Please make sure you select an option on each combo box!");
        return false;
    }
    else if (($("#clientsComboBox").prop("selectedIndex") && $("paymentMethodComboBox").prop("selectedIndex") && $("#firmsComboBox").prop("selectedIndex") && $("#productsComboBoxComboBox").prop("selectedIndex")) != -1 && $(".addedProducts tr").length == 1) {
        alert("Please add products to the table!");
        return false;
    }
    else {
        return true;
    }
}


function toggleErrorPopup() {
    let popupError = document.querySelectorAll(".popupError");
    popupError.forEach(item => {
        let popupErrorText = item.querySelectorAll(".popupErrorText");
        item.addEventListener("mouseover", function () {
            popupErrorText[0].classList.add("show");
        })
        item.addEventListener("mouseout", function () {
            popupErrorText[0].classList.remove("show");
        })
    })
}

let txtBoxesSum = 0;
function totalTextBoxes() {
    let txtBoxDanOsnova = document.getElementById("txtBoxDanOsnova");
    let txtBoxDDS = document.getElementById("txtBoxDDS");
    let txtBoxSum = document.getElementById("txtBoxSum");
    let DDS20 = document.getElementById("DDS20");
    $(".addedProducts").find("td").eq(4).each(function () {
        txtBoxesSum += parseFloat(this.innerHTML);
        txtBoxDanOsnova.value = txtBoxesSum.toFixed(2);
        if (DDS20.checked == true) {
            txtBoxDDS.value = (txtBoxDanOsnova.value * 0.2).toFixed(2)
            txtBoxSum.value = (parseFloat(txtBoxDanOsnova.value) + parseFloat(txtBoxDDS.value)).toFixed(2);
        }
        else {
            txtBoxDDS.value = (txtBoxDanOsnova.value * 0.09).toFixed(2);
            txtBoxSum.value = (parseFloat(txtBoxDanOsnova.value) + parseFloat(txtBoxDDS.value)).toFixed(2);
        }
    })
}

function fillPrintPreviewInfo() {
    if ($(".addedProducts tbody tr").length > 20) {
        alert("You have reached the maximum allowed table rows!\nMaximum table rows are 20, please remove some rows if you wish to print this invoice.");
        return;
    }
    if (newInvoiceGroupBoxesValidated()) {
        $("#printPreviewPopup").find(".appended").remove();
        let form = document.querySelector(".form");
        form.style.filter = "blur(10px)";
        form.style.pointerEvents = "none";
        $("#printPreviewPopup").css("display", "grid");
        document.querySelector("#closePrintPreview button").addEventListener("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("printPreviewPopup");
        })
        $("#groupRecipientSecondRow div:eq(0)").append(`<p class="appended" style="font-weight:bold">${$("#clientsComboBox option:selected").text()}</p>`);
        $.ajax({
            url: "phpScript.php",
            type: "POST",
            data: {
                function: "GetPrintPreviewRecipientInfo",
                customerId: $("#clientsComboBox").prop("selectedIndex")
            },
            success: function (result) {
                let parsedJson = JSON.parse(result);
                $("#groupRecipientSecondRow div:eq(1)").append(`<p class="appended">${parsedJson[0].CustomerECODE}</p>`);
                $("#groupRecipientSecondRow div:eq(2)").append(`<p class="appended">${parsedJson[0].CustomerVATCODE}</p>`);
                $("#groupRecipientSecondRow div:eq(3)").append(`<p class="appended">${parsedJson[0].CustomerAddress}</p>`);
                $("#groupRecipientSecondRow div:eq(4)").append(`<p class="appended">${parsedJson[0].CustomerMOL}</p>`);
            }
        });
        $.ajax({
            url: "phpScript.php",
            type: "POST",
            data: {
                function: "GetPrintPreviewSellerInfo",
                myFirmId: $("#firmsComboBox").prop("selectedIndex")
            },
            success: function (result) {
                let parsedJson = JSON.parse(result);
                $("#groupSellerSecondRow div:eq(0)").append(`<p class="appended" style="font-weight:bold">${parsedJson[0].MyFirmName}</p>`);
                $("#groupSellerSecondRow div:eq(1)").append(`<p class="appended">${parsedJson[0].MyFirmECODE}</p>`);
                $("#groupSellerSecondRow div:eq(2)").append(`<p class="appended">${parsedJson[0].MyFirmVATECODE}</p>`);
                $("#groupSellerSecondRow div:eq(3)").append(`<p class="appended">${parsedJson[0].MyFirmAddress}</p>`);
                $("#groupSellerSecondRow div:eq(4)").append(`<p class="appended">${parsedJson[0].MyFirmMOL}</p>`);
            }
        });
        $("#groupTextInvNo div").append(`<p class="appended">${$("#invNumber").val()}</p>`);
        if ($("#chkBox").is(":checked")) {
            $("#groupTextInvNo div").append(`<p class="appended" style="position:absolute; margin-left:3em; margin-top:1.5em;font-weight:100; font-size:20px">${$("#chkBox").val()}</p>`);
        }
        $.ajax({
            url: "phpScript.php",
            type: "POST",
            data: {
                function: "GetPrintPreviewDatesInfo",
                customerId: $("#clientsComboBox").prop("selectedIndex")
            },
            success: function (result) {
                let parsedJson = JSON.parse(result);
                $("#groupInvDataDates div:eq(0)").append(`<p class="appended">${formattedDate}</p>`);
                $("#groupInvDataDates div:eq(1)").append(`<p class="appended">${dealDate}</p>`);
                $("#groupInvDataDates div:eq(2)").append(`<p class="appended">${parsedJson[0].CustomerAddress}</p>`);
            }
        });
        $(".addedProducts tbody tr").clone().appendTo("#groupDataTable table>tbody").css("border", "none").addClass("appended").find("td").removeAttr("style");
        for (let i = 0; i < $("#groupDataTable table tr").length; i++) {
            $("#groupDataTable table>tbody tr").eq(i).prepend(`<td>${i + 1}</td>`);
            $("#groupDataTable table>tbody tr").eq(i).append($(`#groupDataTable table>tbody tr:eq(${i}) td`).eq(5).clone());
        }
        $.ajax({
            url: "phpScript.php",
            type: "POST",
            data: {
                function: "SellerBankInfo",
                sellerId: $("#firmsComboBox").prop("selectedIndex")
            },
            success: function (result) {
                let parsedJson = JSON.parse(result);
                $("#groupBankAndSum div:eq(0)>div:eq(0)").append(`<p class="appended">${parsedJson[0].MyFirmBANKNAME}</p>`);
                $("#groupBankAndSum div:eq(0)>div:eq(1)").append(`<p class="appended">${parsedJson[0].MyFirmIBAN}</p>`);
                $("#groupBankAndSum div:eq(0)>div:eq(2)").append(`<p class="appended">${parsedJson[0].MyFirmBANKCODE}</p>`);
                $("#groupBankAndSum div:nth-child(3)>div:eq(0)").append(`<p class="appended">${$("#txtBoxDanOsnova").val()}</p>`);
                $("#groupBankAndSum div:nth-child(3)>div:eq(1)").append(`<p class="appended">${$("#txtBoxDDS").val()}</p>`);
                $("#groupBankAndSum div:nth-child(3)>div:eq(2)").append(`<p class="appended">${$("#txtBoxSum").val()}</p>`);
            }
        })
        $("#groupPaymentMethodAndVerbally div:eq(0) div").append(`<p class="appended">${$("#paymentMethodComboBox option:selected").text()}</p>`);
        $.ajax({
            url: "phpScript.php",
            type: "POST",
            data: {
                function: "ProtocolDataInfo",
                id: $("#firmsComboBox").prop("selectedIndex")
            },
            success: function (result) {
                let parsedJson = JSON.parse(result);
                $("#groupProtocolData div:eq(0)>div:eq(0)").append(`<p class="appended">${$("#clientsComboBox option:selected").text()}</p>`);
                $("#groupProtocolData div:nth-child(2)>div:eq(0)").append(`<p class="appended">${parsedJson[0].MyFirmMOL}</p>`);
                $("#groupProtocolData div:nth-child(2)>div:eq(1)").append(`<p class="appended">${parsedJson[0].MyFirmECODE}</p>`);
            }
        })
    }
}

function newInvoiceDeleteTableRow() {
    if ($(".addedProducts").find(".selected").length == 0) {
        alert("You have not selected a row to delete.\nPlease select the row you wish to delete!")
    }
    else {
        txtBoxesSum -= $(".addedProducts").find(".selected").closest("tr").children("td").eq(4).text();
        $(".addedProducts").find(".selected").closest("tr").remove();
    }
    let txtBoxDanOsnova = document.getElementById("txtBoxDanOsnova");
    let txtBoxDDS = document.getElementById("txtBoxDDS");
    let txtBoxSum = document.getElementById("txtBoxSum");
    let DDS20 = document.getElementById("DDS20");
    txtBoxDanOsnova.value = txtBoxesSum.toFixed(2);
    if (DDS20.checked == true) {
        txtBoxDDS.value = (txtBoxDanOsnova.value * 0.2).toFixed(2)
        txtBoxSum.value = (parseFloat(txtBoxDanOsnova.value) + parseFloat(txtBoxDDS.value)).toFixed(2);
    }
    else {
        txtBoxDDS.value = (txtBoxDanOsnova.value * 0.09).toFixed(2);
        txtBoxSum.value = (parseFloat(txtBoxDanOsnova.value) + parseFloat(txtBoxDDS.value)).toFixed(2);
    }
}

function newInvoiceDeleteInvoice() {
    nextInvoiceNumber();
    document.getElementById("invDate").valueAsDate = new Date();
    txtBoxesSum = 0;
    $("#txtBoxDanOsnova").val("");
    $("#txtBoxDDS").val("");
    $("#txtBoxSum").val("");
    $("#DDS20").prop("checked", true);
    $("#DDS9").prop("checked", false);
    $("#clientsComboBox").prop("selectedIndex", -1);
    $("#paymentMethodComboBox").prop("selectedIndex", -1);
    $("#productsComboBox").prop("selectedIndex", -1);
    $("#firmsComboBox").prop("selectedIndex", -1);
    $("#inputSearch").val("");
    $(".addedProducts tbody").empty();
    $("#chkBox").prop("checked", false);
    $(".form").find(".popupError").remove();
    emptyComboBoxAddPopup("clientsGroupBox");
    emptyComboBoxAddPopup("firmsGroupBox");
    emptyComboBoxAddPopup("paymentMethodGroupBox");
    emptyComboBoxAddPopup("productsGroupBox");
    toggleErrorPopup();
}

function printDialog() {
    if (newInvoiceGroupBoxesValidated()) {
        if ($(".addedProducts tbody tr").length > 20) {
            alert("You have reached the maximum allowed table rows!\nMaximum table rows are 20, please remove some rows if you wish to print this invoice.");
            return;
        }
        fillPrintPreviewInfo();
        document.title = `Фактура номер ${$("#invNumber").val()}`;
        $("#printPreviewPopup").css({ "overflow-y": "hidden" });
        $("#closePrintPreview").hide();
        $("#printPreviewPopup").printThis({
            afterPrint: setTimeout(function () {
                let form = document.querySelector(".form");
                form.style.filter = "blur(0px)";
                form.style.pointerEvents = "auto";
                closePopupWindow("printPreviewPopup");
                $("#closePrintPreview").show();
                document.title = "Document";
                $("#printPreviewPopup").css({ "overflow-y": "auto", "height": "" });
            }, 1000),
        });
    }
}


/*END OF NEW INVOICE TAB*/

/*START OF PRODUCTS TAB*/

//FUNCTIONS
let productTableCountOnLoad = 0;
function productsTableOnLoad() {
    $.ajax({
        url: "phpScript.php",
        type: "GET",
        data: {
            function: "ProductsTableOnLoad",
        },
        success: function (result) {
            $(".productsInDB tbody").append(result)
            productTableCountOnLoad = $(".productsInDB tbody tr").length;
        }
    })
}

function emptyInputProductsInputFieldsAddPopup(divEq, inputID) {
    if ($(`#${inputID}`).val().length == 0 && !$(`.productsInputFields div:eq(${divEq}) .popupError`).length > 0) {
        if (divEq == "0" || divEq == "3" || divEq == "4" || divEq == "5") {
            $('<i class="popupError fa-solid fa-circle-exclamation" style="color: #ff0000;"><span class="popupErrorText">Моля въведете стойност<br>Може да е само цифра!</span></i>').appendTo($(`.productsInputFields div:eq(${divEq})`)).css({ "display": "flex", "margin-left": "0.7em" });
        }
        else if (divEq == "1" || divEq == "2") {
            $('<i class="popupError fa-solid fa-circle-exclamation" style="color: #ff0000;"><span class="popupErrorText">Моля въведете стойност</span></i>').appendTo($(`.productsInputFields div:eq(${divEq})`)).css({ "display": "flex", "margin-left": "0.7em" });
        }
    }
    else {
        if (inputID == "naimenovanieInput" || inputID == "mqrkaInput") {
            if ($(`#${inputID}`).val().length == 0) {
                if ($(`.productsInputFields div:eq(${divEq}) .popupError`).length > 0) {
                    toggleErrorPopup();
                    return;
                }
                toggleErrorPopup();
                return;
            }
            else {
                $(`.productsInputFields div:eq(${divEq})`).find(".popupError").fadeOut(150, function () {
                    $(this).remove();
                });
            }
        }
        else {
            if (!$.isNumeric($(`#${inputID}`).val())) {
                if ($(`.productsInputFields div:eq(${divEq}) .popupError`).length > 0) {
                    toggleErrorPopup();
                    return;
                }
                toggleErrorPopup();
                return;
            }
            else {
                $(`.productsInputFields div:eq(${divEq})`).find(".popupError").fadeOut(150, function () {
                    $(this).remove();
                });
            }
        }
    }
}

function productsInputsValidated() {
    if (!$.isNumeric($("#kodNaProduktInput").val()) || $("#naimenovanieInput").val().length == 0 || $("#mqrkaInput").val().length == 0 || !$.isNumeric($("#quantityInput").val()) || !$.isNumeric($("#dostCenaInput").val()) || !$.isNumeric($("#prodCenaInput").val())) {
        return false;
    }
    else {
        return true;
    }
}

function productsAddInputsAsTableRow() {
    if (productsInputsValidated()) {
        let hasDuplicates = false;
        $(".productsInDB tbody tr td").each(function () {
            if ($("#kodNaProduktInput").val() == $(this).text()) {
                alert(`There is a product with code ${$(this).text()} in the table!\nPlease type in a different product code`);
                hasDuplicates = true;
                return false;
            }
        });
        if (hasDuplicates == false) {
            $(".productsInDB tbody").append(`
            <tr>
            <td>${$("#kodNaProduktInput").val()}</td>
            <td>${$("#naimenovanieInput").val()}</td>
            <td>${$("#mqrkaInput").val()}</td>
            <td>${$("#quantityInput").val()}</td>
            <td>${$("#dostCenaInput").val()}</td>
            <td>${$("#prodCenaInput").val()}</td>
            </tr>`);
        }
    }
    else {
        alert("Please make sure you have entered the respective value for each input!");
        return;
    }
}

function addProductsToDB() {
    if ($(".productsInDB tbody tr").length > productTableCountOnLoad) {
        document.getElementById("productsSavePopup").style.display = "grid";
        let form = document.querySelector(".form");
        form.style.filter = "blur(10px)";
        form.style.pointerEvents = "none";
        let buttonSave = document.getElementById("btnSaveProductsPopup");
        buttonSave.addEventListener("click", function () {
            $(".productsInDB tbody tr").each(function () {
                $.ajax({
                    url: "phpScript.php",
                    type: "POST",
                    data: {
                        function: "AddProductsToDB",
                        id: $(this).children("td").eq(0).text(),
                        code: $(this).children("td").eq(0).text(),
                        name: $(this).children("td").eq(1).text(),
                        measure: $(this).children("td").eq(2).text(),
                        quantity: $(this).children("td").eq(3).text(),
                        dostCena: $(this).children("td").eq(4).text(),
                        prodCena: $(this).children("td").eq(5).text()
                    },
                    success: function () {
                        form.style.filter = "blur(0px)";
                        form.style.pointerEvents = "auto";
                        closePopupWindow("productsSavePopup");
                        $("#kodNaProduktInput").val("");
                        $("#naimenovanieInput").val("")
                        $("#mqrkaInput").val("");
                        $("#quantityInput").val("");
                        $("#dostCenaInput").val("");
                        $("#prodCenaInput").val("");
                        emptyInputProductsInputFieldsAddPopup("0", "kodNaProduktInput");
                        emptyInputProductsInputFieldsAddPopup("1", "naimenovanieInput");
                        emptyInputProductsInputFieldsAddPopup("2", "mqrkaInput");
                        emptyInputProductsInputFieldsAddPopup("3", "quantityInput");
                        emptyInputProductsInputFieldsAddPopup("4", "dostCenaInput");
                        emptyInputProductsInputFieldsAddPopup("5", "prodCenaInput");
                    }
                })
            })
            alert("Changes saved successfully!");
        })
        let buttonCancel = document.getElementById("btnCancelProductsPopup");
        buttonCancel.addEventListener("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("productsSavePopup")
        }, { once: true });
        document.getElementById("productsXButton").addEventListener("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("productsSavePopup");
        }, { once: true });
    }
    else {
        alert("Няма нови записи в таблицата!");
    }
}

function editProductPopup() {
    if ($(".products").find(".selected").length > 0) {
        $(".productsInDB").find(".selected").removeClass("selected").css({ "background-color": "", "color": "" }).closest("tr").addClass("selected");
        let selectedRowCode = $(".selected td:eq(0)").text();
        $(".selected").each(function () {
            $("#editPopupKod").val($(this).children("td").eq(0).text());
            $("#editPopupName").val($(this).children("td").eq(1).text());
            $("#editPopupMeasure").val($(this).children("td").eq(2).text());
            $("#editPopupQuantity").val($(this).children("td").eq(3).text());
            $("#editPopupDostCena").val($(this).children("td").eq(4).text());
            $("#editPopupProdCena").val($(this).children("td").eq(5).text());
        })
        emptyInputProductsEditPopupAddPopup("0", "editPopupKod");
        emptyInputProductsEditPopupAddPopup("1", "editPopupName");
        emptyInputProductsEditPopupAddPopup("2", "editPopupMeasure");
        emptyInputProductsEditPopupAddPopup("3", "editPopupQuantity");
        emptyInputProductsEditPopupAddPopup("4", "editPopupDostCena");
        emptyInputProductsEditPopupAddPopup("5", "editPopupProdCena");
        toggleErrorPopup();
        document.getElementById("productsEditPopup").style.display = "grid";
        let form = document.querySelector(".form");
        form.style.filter = "blur(10px)";
        form.style.pointerEvents = "none";
        //fixed triggering multiple alerts below - https://stackoverflow.com/questions/8408826/bind-event-only-once
        $("#editPopupSaveButton").off("click").on("click", function () {
            if (productsEditPopupInputsValidated()) {
                $.ajax({
                    url: "phpScript.php",
                    type: "POST",
                    data: {
                        function: "EditProductInDB",
                        id: selectedRowCode,
                        code: $("#editPopupKod").val(),
                        name: $("#editPopupName").val(),
                        measure: $("#editPopupMeasure").val(),
                        quantity: $("#editPopupQuantity").val(),
                        dostCena: $("#editPopupDostCena").val(),
                        prodCena: $("#editPopupProdCena").val()
                    },
                    success: function () {
                        form.style.filter = "blur(0px)";
                        form.style.pointerEvents = "auto";
                        closePopupWindow("productsEditPopup");
                        $(".productsInDB tbody").empty();
                        productsTableOnLoad();
                    }
                })
                alert("Record successfully updated!");
            }
            else {
                alert("Invalid values in one or more inputs!");
            }
        })
        $("#editPopupXButton").on("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("productsEditPopup");
        })
        $("#editPopupCancelButton").on("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("productsEditPopup");
        })
    }
    else {
        alert("Please select the row from the table you wish to edit!");
    }
}

function emptyInputProductsEditPopupAddPopup(divEq, inputID) {
    if ($(`#${inputID}`).val().length == 0 && !$(`#productsEditPopup div:nth-child(3) div:eq(${divEq}) .popupError`).length > 0) {
        if (divEq == "0" || divEq == "3" || divEq == "4" || divEq == "5") {
            $('<i class="popupError fa-solid fa-circle-exclamation" style="color: #ff0000;"><span class="popupErrorText">Моля въведете стойност<br>Може да е само цифра!</span></i>').appendTo($(`#productsEditPopup div:nth-child(3) div:eq(${divEq})`)).css({ "display": "inline" });
        }
        else if (divEq == "1" || divEq == "2") {
            $('<i class="popupError fa-solid fa-circle-exclamation" style="color: #ff0000;"><span class="popupErrorText">Моля въведете стойност</span></i>').appendTo($(`#productsEditPopup div:nth-child(3) div:eq(${divEq})`)).css({ "display": "inline" });
        }
    }
    else {
        if (inputID == "editPopupName" || inputID == "editPopupMeasure") {
            if ($(`#${inputID}`).val().length == 0) {
                if ($(`#productsEditPopup div:nth-child(3) div:eq(${divEq}) .popupError`).length > 0) {
                    toggleErrorPopup();
                    return;
                }
                toggleErrorPopup();
                return;
            }
            else {
                $(`#productsEditPopup div:nth-child(3) div:eq(${divEq})`).find(".popupError").fadeOut(150, function () {
                    $(this).remove();
                });
            }
        }
        else {
            if (!$.isNumeric($(`#${inputID}`).val())) {
                if ($(`#productsEditPopup div:nth-child(3) div:eq(${divEq}) .popupError`).length > 0) {
                    toggleErrorPopup();
                    return;
                }
                toggleErrorPopup();
                return;
            }
            else {
                $(`#productsEditPopup div:nth-child(3) div:eq(${divEq})`).find(".popupError").fadeOut(150, function () {
                    $(this).remove();
                });
            }
        }
    }
}

function productsEditPopupInputsValidated() {
    if (!$.isNumeric($("#editPopupKod").val()) || $("#editPopupName").val().length == 0 || $("#editPopupMeasure").val().length == 0 || !$.isNumeric($("#editPopupQuantity").val()) || !$.isNumeric($("#editPopupDostCena").val()) || !$.isNumeric($("#editPopupProdCena").val())) {
        return false;
    }
    else {
        return true;
    }
}

function productsDeleteProduct() {
    if ($(".products").find(".selected").length > 0) {
        let form = document.querySelector(".form");
        form.style.filter = "blur(10px)";
        form.style.pointerEvents = "none";
        $("#productsDeleteProductPopup").css("display", "grid");
        $("#productsDeleteWarningMessage p").remove();
        $(".productsInDB").find(".selected").removeClass("selected").css({ "background-color": "", "color": "" }).closest("tr").addClass("selected");
        $("#productsDeleteWarningMessage").append(`<p>Сигурни ли сте, че искате да изтриете продукт с код - <b>${$(".selected td:eq(0)").text()}</b></p>`);
        $("#productsBtnDeleteYes").off("click").on("click", function () {
            $.ajax({
                url: "phpScript.php",
                type: "POST",
                data: {
                    function: "ProductsDeleteProduct",
                    code: $(".selected td:eq(0)").text()
                },
                success: function () {
                    form.style.filter = "blur(0px)";
                    form.style.pointerEvents = "auto";
                    closePopupWindow("productsDeleteProductPopup");
                    $(".productsInDB tbody").empty();
                    productsTableOnLoad();
                }
            })
            alert(`Product with a code - ${$(".selected td:eq(0)").text()} has been successfully deleted!`);
            $(".productsInDB .selected").remove();
        })
        $("#productsDeleteXButton").on("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("productsDeleteProductPopup");
        })
        $("#productsDeleteBtnCancel").on("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("productsDeleteProductPopup");
        })
    }
    else {
        alert("Please select the row from the table you wish to edit!");
    }
}



function productsCancelButton() {
    $(".productsInDB").find(".selected").css({ "background-color": "", "color": "" }).removeClass("selected");
    $(".productsInDB").find(".foundText").css({ "background-color": "", "color": "" }).removeClass("foundText");
    $("#productsSearchBox").val("");
    $("#kodNaProduktInput").val("");
    $("#naimenovanieInput").val("");
    $("#mqrkaInput").val("");
    $("#quantityInput").val("");
    $("#dostCenaInput").val("");
    $("#prodCenaInput").val("");
    emptyInputProductsInputFieldsAddPopup("0", "kodNaProduktInput");
    emptyInputProductsInputFieldsAddPopup("1", "naimenovanieInput");
    emptyInputProductsInputFieldsAddPopup("2", "mqrkaInput");
    emptyInputProductsInputFieldsAddPopup("3", "quantityInput");
    emptyInputProductsInputFieldsAddPopup("4", "dostCenaInput");
    emptyInputProductsInputFieldsAddPopup("5", "prodCenaInput");
}

/*END OF PRODUCTS TAB*/

/*START OF CUSTOMERS TAB*/

let customersTableCountOnLoad = 0;
function customersTableOnLoad() {
    $.ajax({
        url: "phpScript.php",
        type: "GET",
        data: {
            function: "CustomersTableOnLoad",
        },
        success: function (result) {
            $(".customersInDB tbody").append(result)
            customersTableCountOnLoad = $(".customersInDB tbody tr").length;
        }
    })
}

function emptyInputCustomersInputFieldsAddPopup(divEq, inputID) {
    if ($(`#${inputID}`).val().length == 0 && !$(`.customersInputFields div:eq(${divEq}) .popupError`).length > 0) {
        if (divEq == "0" || divEq == "4" || divEq == "5") {
            $('<i class="popupError fa-solid fa-circle-exclamation" style="color: #ff0000;"><span class="popupErrorText">Моля въведете стойност<br>Може да е само цифра!</span></i>').appendTo($(`.customersInputFields div:eq(${divEq})`)).css({ "display": "flex", "margin-left": "0.7em" });
        }
        else if (divEq == "1" || divEq == "2" || divEq == "3") {
            $('<i class="popupError fa-solid fa-circle-exclamation" style="color: #ff0000;"><span class="popupErrorText">Моля въведете стойност</span></i>').appendTo($(`.customersInputFields div:eq(${divEq})`)).css({ "display": "flex", "margin-left": "0.7em" });
        }
    }
    else {
        if (inputID == "customersImeInput" || inputID == "customersAddressInput" || inputID == "customersMOLInput") {
            if ($(`#${inputID}`).val().length == 0) {
                if ($(`.customersInputFields div:eq(${divEq}) .popupError`).length > 0) {
                    toggleErrorPopup();
                    return;
                }
                toggleErrorPopup();
                return;
            }
            else {
                $(`.customersInputFields div:eq(${divEq})`).find(".popupError").fadeOut(150, function () {
                    $(this).remove();
                });
            }
        }
        else {
            if (!$.isNumeric($(`#${inputID}`).val())) {
                if ($(`.customersInputFields div:eq(${divEq}) .popupError`).length > 0) {
                    toggleErrorPopup();
                    return;
                }
                toggleErrorPopup();
                return;
            }
            else {
                $(`.customersInputFields div:eq(${divEq})`).find(".popupError").fadeOut(150, function () {
                    $(this).remove();
                });
            }
        }
    }
}

function customersInputsValidated() {
    if (!$.isNumeric($("#customersKodInput").val()) || $("#customersImeInput").val().length == 0 || $("#customersAddressInput").val().length == 0 || $("#customersMOLInput").val().length == 0 || !$.isNumeric($("#customersEKodInput").val()) || !$.isNumeric($("#customersZDDSInput").val())) {
        return false;
    }
    else {
        return true;
    }
}

function customersAddInputsAsTableRow() {
    if (customersInputsValidated()) {
        let hasDuplicates = false;
        $(".customersInDB tbody tr td").each(function () {
            if ($("#customersKodInput").val() == $(this).text()) {
                alert(`There is a product with code ${$(this).text()} in the table!\nPlease type in a different product code`);
                hasDuplicates = true;
                return false;
            }
        });
        if (hasDuplicates == false) {
            $(".customersInDB tbody").append(`
            <tr>
            <td>${$("#customersKodInput").val()}</td>
            <td>${$("#customersImeInput").val()}</td>
            <td>${$("#customersAddressInput").val()}</td>
            <td>${$("#customersMOLInput").val()}</td>
            <td>${$("#customersEKodInput").val()}</td>
            <td>${$("#customersZDDSInput").val()}</td>
            </tr>`);
        }
    }
    else {
        alert("Please make sure you have entered the respective value for each input!");
        return;
    }
}

function addCustomersToDB() {
    if ($(".customersInDB tbody tr").length > customersTableCountOnLoad) {
        document.getElementById("customersSavePopup").style.display = "grid";
        let form = document.querySelector(".form");
        form.style.filter = "blur(10px)";
        form.style.pointerEvents = "none";
        let buttonSave = document.getElementById("btnSaveCustomersPopup");
        buttonSave.addEventListener("click", function () {
            $(".customersInDB tbody tr").each(function () {
                $.ajax({
                    url: "phpScript.php",
                    type: "POST",
                    data: {
                        function: "AddCustomersToDB",
                        id: $(this).children("td").eq(0).text(),
                        name: $(this).children("td").eq(1).text(),
                        address: $(this).children("td").eq(2).text(),
                        mol: $(this).children("td").eq(3).text(),
                        ecode: $(this).children("td").eq(4).text(),
                        vatcode: $(this).children("td").eq(5).text()
                    },
                    success: function () {
                        form.style.filter = "blur(0px)";
                        form.style.pointerEvents = "auto";
                        closePopupWindow("customersSavePopup");
                        $("#customersKodInput").val("");
                        $("#customersImeInput").val("");
                        $("#customersAddressInput").val("");
                        $("#customersMOLInput").val("");
                        $("#customersEKodInput").val("");
                        $("#customersZDDSInput").val("");
                        emptyInputCustomersInputFieldsAddPopup("0", "customersKodInput");
                        emptyInputCustomersInputFieldsAddPopup("1", "customersImeInput");
                        emptyInputCustomersInputFieldsAddPopup("2", "customersAddressInput");
                        emptyInputCustomersInputFieldsAddPopup("3", "customersMOLInput");
                        emptyInputCustomersInputFieldsAddPopup("4", "customersEKodInput");
                        emptyInputCustomersInputFieldsAddPopup("5", "customersZDDSInput");
                    }
                })
            })
            alert("Changes saved successfully!");
        })
        $("#btnCancelCustomersPopup").on("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("customersSavePopup")
        })
        $("#customersXButton").on("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("customersSavePopup")
        })
    }
    else {
        alert("Няма нови записи в таблицата!");
    }
}

function editCustomersPopup() {
    if ($(".customers").find(".selected").length > 0) {
        $(".customersInDB").find(".selected").removeClass("selected").css({ "background-color": "", "color": "" }).closest("tr").addClass("selected");
        let selectedRowCode = $(".selected td:eq(0)").text();
        $(".selected").each(function () {
            $("#customersEditPopupKod").val($(this).children("td").eq(0).text());
            $("#customersEditPopupName").val($(this).children("td").eq(1).text());
            $("#customersEditPopupAddress").val($(this).children("td").eq(2).text());
            $("#customersEditPopupMOL").val($(this).children("td").eq(3).text());
            $("#customersEditPopupECODE").val($(this).children("td").eq(4).text());
            $("#customersEditPopupZDDS").val($(this).children("td").eq(5).text());
        })

        emptyInputCustomersEditPopupAddPopup("0", "customersEditPopupKod");
        emptyInputCustomersEditPopupAddPopup("1", "customersEditPopupName");
        emptyInputCustomersEditPopupAddPopup("2", "customersEditPopupAddress");
        emptyInputCustomersEditPopupAddPopup("3", "customersEditPopupMOL");
        emptyInputCustomersEditPopupAddPopup("4", "customersEditPopupECODE");
        emptyInputCustomersEditPopupAddPopup("5", "customersEditPopupZDDS");
        toggleErrorPopup();
        document.getElementById("customersEditPopup").style.display = "grid";
        let form = document.querySelector(".form");
        form.style.filter = "blur(10px)";
        form.style.pointerEvents = "none";
        //fixed triggering multiple alerts below - https://stackoverflow.com/questions/8408826/bind-event-only-once
        $("#customersEditPopupSaveButton").off("click").on("click", function () {
            if (customersEditPopupInputsValidated()) {
                $.ajax({
                    url: "phpScript.php",
                    type: "POST",
                    data: {
                        function: "EditCustomersInDB",
                        id: selectedRowCode,
                        editId: $("#customersEditPopupKod").val(),
                        name: $("#customersEditPopupName").val(),
                        address: $("#customersEditPopupAddress").val(),
                        mol: $("#customersEditPopupMOL").val(),
                        ecode: $("#customersEditPopupECODE").val(),
                        zdds: $("#customersEditPopupZDDS").val()
                    },
                    success: function () {
                        form.style.filter = "blur(0px)";
                        form.style.pointerEvents = "auto";
                        closePopupWindow("customersEditPopup");
                        $(".customersInDB tbody").empty();
                        customersTableOnLoad();
                    }
                })
                alert("Record successfully updated!");
            }
            else {
                alert("Invalid values in one or more inputs!");
            }
        })
        $("#customersEditPopupXButton").on("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("customersEditPopup");
        })
        $("#customersEditPopupCancelButton").on("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("customersEditPopup");
        })
    }
    else {
        alert("Please select the row from the table you wish to edit!");
    }
}

function emptyInputCustomersEditPopupAddPopup(divEq, inputID) {
    if ($(`#${inputID}`).val().length == 0 && !$(`#customersEditPopup div:nth-child(3) div:eq(${divEq}) .popupError`).length > 0) {
        if (divEq == "0" || divEq == "4" || divEq == "5") {
            $('<i class="popupError fa-solid fa-circle-exclamation" style="color: #ff0000;"><span class="popupErrorText">Моля въведете стойност<br>Може да е само цифра!</span></i>').appendTo($(`#customersEditPopup div:nth-child(3) div:eq(${divEq})`)).css({ "display": "inline" });
        }
        else if (divEq == "1" || divEq == "2" || divEq == "3") {
            $('<i class="popupError fa-solid fa-circle-exclamation" style="color: #ff0000;"><span class="popupErrorText">Моля въведете стойност</span></i>').appendTo($(`#customersEditPopup div:nth-child(3) div:eq(${divEq})`)).css({ "display": "inline" });
        }
    }
    else {
        if (inputID == "customersEditPopupName" || inputID == "customersEditPopupAddress" || inputID == "customersEditPopupMOL") {
            if ($(`#${inputID}`).val().length == 0) {
                if ($(`#customersEditPopup div:nth-child(3) div:eq(${divEq}) .popupError`).length > 0) {
                    toggleErrorPopup();
                    return;
                }
                toggleErrorPopup();
                return;
            }
            else {
                $(`#customersEditPopup div:nth-child(3) div:eq(${divEq})`).find(".popupError").fadeOut(150, function () {
                    $(this).remove();
                });
            }
        }
        else {
            if (!$.isNumeric($(`#${inputID}`).val())) {
                if ($(`#customersEditPopup div:nth-child(3) div:eq(${divEq}) .popupError`).length > 0) {
                    toggleErrorPopup();
                    return;
                }
                toggleErrorPopup();
                return;
            }
            else {
                $(`#customersEditPopup div:nth-child(3) div:eq(${divEq})`).find(".popupError").fadeOut(150, function () {
                    $(this).remove();
                });
            }
        }
    }
}

function customersEditPopupInputsValidated() {
    if (!$.isNumeric($("#customersEditPopupKod").val()) || $("#customersEditPopupName").val().length == 0 || $("#customersEditPopupAddress").val().length == 0 || $("#customersEditPopupMOL").val().length == 0 || !$.isNumeric($("#customersEditPopupECODE").val()) || !$.isNumeric($("#customersEditPopupZDDS").val())) {
        return false;
    }
    else {
        return true;
    }
}

function customersDeleteCustomer() {
    if ($(".customers").find(".selected").length > 0) {
        let form = document.querySelector(".form");
        form.style.filter = "blur(10px)";
        form.style.pointerEvents = "none";
        $("#customersDeleteCustomerPopup").css("display", "grid");
        $("#customersDeleteWarningMessage p").remove();
        $(".customersInDB").find(".selected").removeClass("selected").css({ "background-color": "", "color": "" }).closest("tr").addClass("selected");
        $("#customersDeleteWarningMessage").append(`<p>Сигурни ли сте, че искате да изтриете клиент с код - <b>${$(".selected td:eq(0)").text()}</b></p>`);
        $("#customersBtnDeleteYes").off("click").on("click", function () {
            $.ajax({
                url: "phpScript.php",
                type: "POST",
                data: {
                    function: "CustomersDeleteCustomer",
                    code: $(".selected td:eq(0)").text()
                },
                success: function () {
                    form.style.filter = "blur(0px)";
                    form.style.pointerEvents = "auto";
                    closePopupWindow("customersDeleteCustomerPopup");
                    $(".customersInDB tbody").empty();
                    customersTableOnLoad();
                }
            })
            alert(`Customer with a code - ${$(".selected td:eq(0)").text()} has been successfully deleted!`);
            $(".customersInDB .selected").remove();
        })
        $("#customersDeleteXButton").on("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("customersDeleteCustomerPopup");
        })
        $("#customersDeleteBtnCancel").on("click", function () {
            form.style.filter = "blur(0px)";
            form.style.pointerEvents = "auto";
            closePopupWindow("customersDeleteCustomerPopup");
        })
    }
    else {
        alert("Please select the row from the table you wish to edit!");
    }
}

function customersCancelButton() {
    $(".customersInDB").find(".selected").css({ "background-color": "", "color": "" }).removeClass("selected");
    $(".customersInDB").find(".foundText").css({ "background-color": "", "color": "" }).removeClass("foundText");
    $("#customersSearchBox").val("");
    $("#customersKodInput").val("");
    $("#customersImeInput").val("");
    $("#customersAddressInput").val("");
    $("#customersMOLInput").val("");
    $("#customersEKodInput").val("");
    $("#customersZDDSInput").val("");
    emptyInputCustomersInputFieldsAddPopup("0", "customersKodInput");
    emptyInputCustomersInputFieldsAddPopup("1", "customersImeInput");
    emptyInputCustomersInputFieldsAddPopup("2", "customersAddressInput");
    emptyInputCustomersInputFieldsAddPopup("3", "customersMOLInput");
    emptyInputCustomersInputFieldsAddPopup("4", "customersEKodInput");
    emptyInputCustomersInputFieldsAddPopup("5", "customersZDDSInput");
}

//EVENTS
document.addEventListener("DOMContentLoaded", function (e) {
    //invoices tab
    tabControl(e, "newInvoice");
    //tabControl(e, "customers"); //using this currently so i dont have to constantly switch tabs when i refresh the page, when done remove this line and uncomment the one above
    setAutoHeight('newInvoice');
    setAutoHeight('invoices');
    setAutoHeight('products');
    setAutoHeight('customers');
    invoicesGridAddSelectedClass();
    dataGridCellClick("addedProducts");
    $(document).on("click", ".invoicesInDB td", function () {
        clickedRowNumberInvoices();
        cellClickNumberInvoices();
    })
    //new invoice tab
    $(document).on("click", ".addedProducts td", function () { //https://stackoverflow.com/questions/44302958/how-to-add-event-handler-on-row-of-table -- event delegation
        colorCells("addedProducts");
    })
    newInvoicesTabOnLoad(true);
    nextInvoiceNumber();
    dateFormat();
    ddsClickChangeValue();
    firmsComboBoxOnLoad();
    clientsComboBoxOnLoad();
    paymentMethodComboBoxOnLoad();
    disabledButtonsCursor();
    productsComboBoxOnLoad();
    emptyComboBoxAddPopup("clientsGroupBox");
    emptyComboBoxAddPopup("firmsGroupBox");
    emptyComboBoxAddPopup("paymentMethodGroupBox");
    emptyComboBoxAddPopup("productsGroupBox");
    toggleErrorPopup();
    document.getElementById("paymentMethodComboBox").addEventListener("change", function () {
        emptyComboBoxAddPopup("paymentMethodGroupBox");
    })
    document.getElementById("productsComboBox").addEventListener("change", function () {
        emptyComboBoxAddPopup("productsGroupBox");
    })
    document.getElementById("clientsComboBox").addEventListener("change", function () {
        emptyComboBoxAddPopup("clientsGroupBox");
    })
    document.getElementById("firmsComboBox").addEventListener("change", function () {
        emptyComboBoxAddPopup("firmsGroupBox");
    })
    document.getElementById("btnNewInvoice").addEventListener("click", function () {
        newInvoiceButtonOnClick();
    })
    document.getElementById("btnCancel").addEventListener("click", function () {
        cancelButtonOnClick();
    })
    document.getElementById("DDS20").addEventListener("click", function () {
        ddsClickChangeValue();
    })
    document.getElementById("DDS9").addEventListener("click", function () {
        ddsClickChangeValue();
    })
    document.getElementById("btnAddProduct").addEventListener("click", function () {
        addSelectedProductToGrid();
    })
    $("button").on("click", function () {
        disabledButtonsCursor();
    })
    document.getElementById("btnSave").addEventListener("click", function () {
        invoiceTabSaveButtonOnClick();
    })
    document.getElementById("btnSave").addEventListener("click", function () {
        addNewInvoiceToDB();
    })
    document.getElementById("btnNextRow").addEventListener("click", function () {
        buttonNextRow("addedProducts");
    })
    document.getElementById("btnPreviousRow").addEventListener("click", function () {
        buttonPreviousRow("addedProducts");
    })
    document.getElementById("btnFirstRow").addEventListener("click", function () {
        buttonFirstRow("addedProducts")
    })
    document.getElementById("btnLastRow").addEventListener("click", function () {
        buttonLastRow("addedProducts");
    })
    document.getElementById("btnSearch").addEventListener("click", function () {
        searchBoxSearch("inputSearch", "addedProducts");
    })
    document.getElementById("newInvoicePopup").style.display = "none";
    document.getElementById("printPreviewPopup").style.display = "none";
    document.getElementById("btnPrintPreview").addEventListener("click", function () {
        fillPrintPreviewInfo();
    })
    document.getElementById("btnDelRow").addEventListener("click", function () {
        newInvoiceDeleteTableRow();
    })
    document.getElementById("btnDelInvoice").addEventListener("click", function () {
        newInvoiceDeleteInvoice();
    })
    document.getElementById("btnDialog").addEventListener("click", function () {
        printDialog();
    })
    document.getElementById("tabNewInvoice").addEventListener("click", function (e) {
        tabControl(e, "newInvoice");
        $("#productsComboBox").empty();
        productsComboBoxOnLoad();
        $(".form").find(".selected").css({ "background-color": "", "color": "" }).removeClass("selected");
        toggleErrorPopup();
    })
    document.getElementById("tabInvoices").addEventListener("click", function (e) {
        tabControl(e, "invoices");
        loadInvoicesFromDB();
        $(".form").find(".selected").css({ "background-color": "", "color": "" }).removeClass("selected");
        toggleErrorPopup();
    })
    document.getElementById("tabProducts").addEventListener("click", function (e) {
        tabControl(e, "products");
        $(".productsInDB tbody").empty();
        productsTableOnLoad();
        $(".form").find(".selected").css({ "background-color": "", "color": "" }).removeClass("selected");
        toggleErrorPopup();
    })
    document.getElementById("tabCustomers").addEventListener("click", function (e) {
        tabControl(e, "customers");
        $(".customersInDB tbody").empty();
        customersTableOnLoad();
        $(".form").find(".selected").css({ "background-color": "", "color": "" }).removeClass("selected");
        toggleErrorPopup();
    })
    //products tab
    productsTableOnLoad();
    emptyInputProductsInputFieldsAddPopup("0", "kodNaProduktInput");
    emptyInputProductsInputFieldsAddPopup("1", "naimenovanieInput");
    emptyInputProductsInputFieldsAddPopup("2", "mqrkaInput");
    emptyInputProductsInputFieldsAddPopup("3", "quantityInput");
    emptyInputProductsInputFieldsAddPopup("4", "dostCenaInput");
    emptyInputProductsInputFieldsAddPopup("5", "prodCenaInput");
    toggleErrorPopup();
    dataGridCellClick("productsInDB");
    $(document).on("click", ".productsInDB td", function () {
        colorCells("productsInDB");
    })
    document.getElementById("kodNaProduktInput").addEventListener("input", function () {
        emptyInputProductsInputFieldsAddPopup("0", "kodNaProduktInput");
        toggleErrorPopup();
    })
    document.getElementById("naimenovanieInput").addEventListener("input", function () {
        emptyInputProductsInputFieldsAddPopup("1", "naimenovanieInput");
        toggleErrorPopup();
    })
    document.getElementById("mqrkaInput").addEventListener("input", function () {
        emptyInputProductsInputFieldsAddPopup("2", "mqrkaInput");
        toggleErrorPopup();
    })
    document.getElementById("quantityInput").addEventListener("input", function () {
        emptyInputProductsInputFieldsAddPopup("3", "quantityInput");
        toggleErrorPopup();
    })
    document.getElementById("dostCenaInput").addEventListener("input", function () {
        emptyInputProductsInputFieldsAddPopup("4", "dostCenaInput");
        toggleErrorPopup();
    })
    document.getElementById("prodCenaInput").addEventListener("input", function () {
        emptyInputProductsInputFieldsAddPopup("5", "prodCenaInput");
        toggleErrorPopup();
    })
    document.getElementById("productsBtnInsert").addEventListener("click", function () {
        productsAddInputsAsTableRow();
    })
    document.getElementById("btnProductsFirstRow").addEventListener("click", function () {
        buttonFirstRow("productsInDB");
    })
    document.getElementById("btnProductsPreviousRow").addEventListener("click", function () {
        buttonPreviousRow("productsInDB");
    })
    document.getElementById("btnProductsNextRow").addEventListener("click", function () {
        buttonNextRow("productsInDB");
    })
    document.getElementById("btnProductsLastRow").addEventListener("click", function () {
        buttonLastRow("productsInDB");
    })
    document.getElementById("btnProductsSearch").addEventListener("click", function () {
        searchBoxSearch("productsSearchBox", "productsInDB")
    })
    document.getElementById("productsSavePopup").style.display = "none";
    document.getElementById("productsBtnSave").addEventListener("click", function () {
        addProductsToDB();
    })
    document.getElementById("productsEditPopup").style.display = "none";
    document.getElementById("productsBtnEdit").addEventListener("click", function () {
        editProductPopup();
    })
    document.getElementById("editPopupKod").addEventListener("input", function () {
        emptyInputProductsEditPopupAddPopup("0", "editPopupKod");
        toggleErrorPopup();
    })
    document.getElementById("editPopupName").addEventListener("input", function () {
        emptyInputProductsEditPopupAddPopup("1", "editPopupName");
        toggleErrorPopup();
    })
    document.getElementById("editPopupMeasure").addEventListener("input", function () {
        emptyInputProductsEditPopupAddPopup("2", "editPopupMeasure");
        toggleErrorPopup();
    })
    document.getElementById("editPopupQuantity").addEventListener("input", function () {
        emptyInputProductsEditPopupAddPopup("3", "editPopupQuantity");
        toggleErrorPopup();
    })
    document.getElementById("editPopupDostCena").addEventListener("input", function () {
        emptyInputProductsEditPopupAddPopup("4", "editPopupDostCena");
        toggleErrorPopup();
    })
    document.getElementById("editPopupProdCena").addEventListener("input", function () {
        emptyInputProductsEditPopupAddPopup("5", "editPopupProdCena");
        toggleErrorPopup();
    })
    document.getElementById("productsDeleteProductPopup").style.display = "none"
    document.getElementById("productsBtnDelete").addEventListener("click", function () {
        productsDeleteProduct();
    })
    document.getElementById("productsBtnCancel").addEventListener("click", function () {
        productsCancelButton();
    })
    //customers tab
    customersTableOnLoad();
    emptyInputCustomersInputFieldsAddPopup("0", "customersKodInput");
    emptyInputCustomersInputFieldsAddPopup("1", "customersImeInput");
    emptyInputCustomersInputFieldsAddPopup("2", "customersAddressInput");
    emptyInputCustomersInputFieldsAddPopup("3", "customersMOLInput");
    emptyInputCustomersInputFieldsAddPopup("4", "customersEKodInput");
    emptyInputCustomersInputFieldsAddPopup("5", "customersZDDSInput");
    toggleErrorPopup();
    dataGridCellClick("customersInDB");
    $(document).on("click", ".customersInDB td", function () {
        colorCells("customersInDB");
    })
    document.getElementById("customersKodInput").addEventListener("input", function () {
        emptyInputCustomersInputFieldsAddPopup("0", "customersKodInput");
        toggleErrorPopup();
    })
    document.getElementById("customersImeInput").addEventListener("input", function () {
        emptyInputCustomersInputFieldsAddPopup("1", "customersImeInput");
        toggleErrorPopup();
    })
    document.getElementById("customersAddressInput").addEventListener("input", function () {
        emptyInputCustomersInputFieldsAddPopup("2", "customersAddressInput");
        toggleErrorPopup();
    })
    document.getElementById("customersMOLInput").addEventListener("input", function () {
        emptyInputCustomersInputFieldsAddPopup("3", "customersMOLInput");
        toggleErrorPopup();
    })
    document.getElementById("customersEKodInput").addEventListener("input", function () {
        emptyInputCustomersInputFieldsAddPopup("4", "customersEKodInput");
        toggleErrorPopup();
    })
    document.getElementById("customersZDDSInput").addEventListener("input", function () {
        emptyInputCustomersInputFieldsAddPopup("5", "customersZDDSInput");
        toggleErrorPopup();
    })
    document.getElementById("btnCustomersFirstRow").addEventListener("click", function () {
        buttonFirstRow("customersInDB");
    })
    document.getElementById("btnCustomersPreviousRow").addEventListener("click", function () {
        buttonPreviousRow("customersInDB");
    })
    document.getElementById("btnCustomersNextRow").addEventListener("click", function () {
        buttonNextRow("customersInDB");
    })
    document.getElementById("btnCustomersLastRow").addEventListener("click", function () {
        buttonLastRow("customersInDB");
    })
    document.getElementById("customersBtnInsert").addEventListener("click", function () {
        customersAddInputsAsTableRow();
    })
    document.getElementById("customersSavePopup").style.display = "none";
    document.getElementById("customersBtnSave").addEventListener("click", function () {
        addCustomersToDB();
    })
    document.getElementById("customersEditPopupKod").addEventListener("input", function () {
        emptyInputCustomersEditPopupAddPopup("0", "customersEditPopupKod");
        toggleErrorPopup();
    })
    document.getElementById("customersEditPopupName").addEventListener("input", function () {
        emptyInputCustomersEditPopupAddPopup("1", "customersEditPopupName");
        toggleErrorPopup();
    })
    document.getElementById("customersEditPopupAddress").addEventListener("input", function () {
        emptyInputCustomersEditPopupAddPopup("2", "customersEditPopupAddress");
        toggleErrorPopup();
    })
    document.getElementById("customersEditPopupMOL").addEventListener("input", function () {
        emptyInputCustomersEditPopupAddPopup("3", "customersEditPopupMOL");
        toggleErrorPopup();
    })
    document.getElementById("customersEditPopupECODE").addEventListener("input", function () {
        emptyInputCustomersEditPopupAddPopup("4", "customersEditPopupECODE");
        toggleErrorPopup();
    })
    document.getElementById("customersEditPopupZDDS").addEventListener("input", function () {
        emptyInputCustomersEditPopupAddPopup("5", "customersEditPopupZDDS");
        toggleErrorPopup();
    })
    document.getElementById("customersEditPopup").style.display = "none";
    document.getElementById("customersBtnEdit").addEventListener("click", function () {
        editCustomersPopup();
    })
    document.getElementById("btnCustomersSearch").addEventListener("click", function () {
        searchBoxSearch("customersSearchBox", "customersInDB");
    })
    document.getElementById("customersDeleteCustomerPopup").style.display = "none";
    document.getElementById("customersBtnDelete").addEventListener("click", function () {
        customersDeleteCustomer();
    })
    document.getElementById("btnCustomersCancel").addEventListener("click", function () {
        customersCancelButton();
    })
})