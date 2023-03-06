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
function dataGridCellClick() {
    $(document).on("click", ".addedProducts td", function () { //event delegation in the middle
        $(".selected").each(function () {
            $(this).removeClass("selected")
        });
        $(this).addClass('selected');
    });
}

document.addEventListener("DOMContentLoaded", function (e) {
    tabControl(e, "newInvoice")
    setAutoHeight('newInvoice');
    setAutoHeight('invoices');
    setAutoHeight('products');
    setAutoHeight('customers');
    loadInvoicesFromDB();
    dataGridCellClick();
    $(document).on("click", ".addedProducts td", function () { //https://stackoverflow.com/questions/44302958/how-to-add-event-handler-on-row-of-table -- event delegation
        colorCells();
    })
    e.target.addEventListener("click", invoicesGridAddSelectedClass)
    e.target.addEventListener("click", colorRow)
    $(document).on("click", ".invoicesInDB td", function () {
        clickedRowNumberInvoices();
        cellClickNumberInvoices();
    })
    document.getElementById("tabNewInvoice").addEventListener("click", function (evt) {
        tabControl(evt, 'newInvoice')
    })
    document.getElementById("tabInvoices").addEventListener("click", function (evt) {
        tabControl(evt, 'invoices')
    })
    document.getElementById("tabProducts").addEventListener("click", function (evt) {
        tabControl(evt, 'products')
    })
    document.getElementById("tabCustomers").addEventListener("click", function (evt) {
        tabControl(evt, 'customers')
    })
})

//FUNCTIONS
function colorCells() {
    let table = document.querySelector(".addedProducts")
    let td = table.getElementsByTagName("td");
    $(".addedProducts tr").css("background-color", "");
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


function invoicesGridAddSelectedClass() {
    $('.invoicesInDB tr').click(function () {
        $('.selectedRow').each(function () {
            $(this).removeClass('selectedRow')
        });
        $(this).addClass('selectedRow');
    });
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
        data: { id: id },
        success: function (res) {
            //alert(res)
            $(".selectedCellInfo>tr").remove();
            $(".selectedCellInfo").append(res);
            $(".selectedCellInfo td:eq(1)").width("25%")

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
    document.querySelector("#btnEditInvoice").disabled = false;
    document.querySelector("#btnDelInvoice").disabled = false;
    document.querySelector("#btnPrintPreview").disabled = false;
    document.querySelector("#btnPrint").disabled = false;
    document.querySelector("#btnDialog").disabled = false;
    document.querySelector("#btnSavePDF").disabled = false;
    document.querySelector("#btnExit").disabled = false;
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
}

let count = 0;
function newInvoiceButtonOnClick() {
    count++;
    if (count == 1) {
        //unlock controls
        newInvoicesTabOnLoad(false);
    }
    else if (count == 2) {
        //add new invoice to db
    }
    else if (count > 2) {
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

function dateFormat() {
    let today = moment().format("DD.MM.YYYY"); //make this a global variable when passing a new invoice date to the db
    document.getElementById("invDate").valueAsDate = new Date();
}

function ddsClickChangeValue() {
    let DDS20 = document.getElementById("DDS20");
    let DDS9 = document.getElementById("DDS9");
    let labelDDS = document.getElementById("labelDDS");
    let txtBoxDanOsnova = document.getElementById("txtBoxDanOsnova");
    let txtBoxDDS = document.getElementById("txtBoxDDS");
    let txtBoxSum = document.getElementById("txtBoxSum");
    if (DDS20.checked && txtBoxDanOsnova.value != "") {
        labelDDS.innerText = DDS20.value;
        labelDDS.style.marginLeft = "0.6em";
        txtBoxDDS.value = (txtBoxDanOsnova.value * 0.2).toFixed(2)
        txtBoxSum.value = (parseFloat(txtBoxDanOsnova.value) + parseFloat(txtBoxDDS.value)).toFixed(2);
    }
    else if (DDS9.checked && txtBoxDanOsnova != "") {
        labelDDS.innerText = DDS9.value;
        labelDDS.style.marginLeft = "0.6em";
        txtBoxDDS.value = (txtBoxDanOsnova.value * 0.09).toFixed(2)
        txtBoxSum.value = (parseFloat(txtBoxDanOsnova.value) + parseFloat(txtBoxDDS.value)).toFixed(2);
    }
    //on startup
    else if (DDS20.checked && txtBoxDanOsnova.value == "") {
        labelDDS.innerText = DDS20.value;
        labelDDS.style.marginLeft = "0.6em";
    }
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
        data: { selectedIndex: selectedIndex },
        success: function (result) {
            $(".addedProducts").append(result);
            $(".addedProducts td:eq(1)").width("25%")
            totalTextBoxes();
        }
    })
}


function addNewInvoiceToDB() {
    if (count == 2) {
        $("#newInvoicePopup p").remove();
        document.getElementById("newInvoicePopup").style.display = "grid";
        let form = document.querySelector(".form");
        form.style.filter = "blur(10px)";
        let fakNo = document.getElementById("invNumber");
        let message = document.createElement("p");
        message.setAttribute("id", "msg")
        message.innerHTML = `Сигурни ли сте че искате да добавите <br>фактура № <u>${fakNo.value}</u> в базата данни?`;
        document.getElementById("warningMessage").append(message)
        let buttonSave = document.getElementById("btnSaveNewInvoicePopup")
        let buttonCancel = document.getElementById("btnCancelNewInvoicePopup");
        buttonSave.addEventListener("click", function (e) {
            e.stopImmediatePropagation(); //https://stackoverflow.com/questions/7822407/why-is-my-alert-showing-more-than-once
            alert("Saved to db!") //here should be the function that adds the stuff from all the comboboxes to the db
            form.style.filter = "blur(0px)";
            closePopupWindow("newInvoicePopup");
        });
        buttonCancel.addEventListener("click", function () {
            form.style.filter = "blur(0px)";
            closePopupWindow("newInvoicePopup")
        }, { once: true });
        document.getElementById("xButton").addEventListener("click", function () {
            form.style.filter = "blur(0px)";
            closePopupWindow("newInvoicePopup");
        }, { once: true });
    }
}


function buttonNextRow(tableClass) {
    //if table has class-lastrowindex? execute this, else color last cell and add class lastrowindex? until there is a selected class
    if ($(`.${tableClass} tr`).hasClass("selectedFirst")) {
        $(`.${tableClass} tr`).removeClass("selectedFirst").css("background-color", "")
        $(`.${tableClass} tr`).closest("table").children("tr").eq(0).addClass("selected");
    }
    let table = document.querySelector(`.${tableClass}`);
    if (!$(`.${tableClass} tr`).hasClass("selectedLast")) {
        if ($(`.${tableClass}`).find('.selected').length == 0) {
            $(`.${tableClass} tr`).closest("table").children("tr:first").addClass("selected");
            $(".selected").css("background-color", "red")
        }
        else {
            if ($(`.${tableClass} td`).hasClass("selected")) {
                $(".selected").css({
                    "background-color": "",
                    "color": ""
                });
                $(".selected").removeClass("selected").closest("tr").next().addClass("selected");
                $(".selected").css("background-color", "red")
            }
            else {
                let cell = table.getElementsByTagName("td");
                $(".selected").css("background-color", "");
                $(".selected").removeClass("selected").closest("tr").next("tr").addClass("selected");
                for (let i = 0; i < cell.length; i++) {
                    if ($(`.${tableClass} tr`).hasClass("selected")) {
                        cell[i].style.backgroundColor = "";
                        cell[i].style.color = "black";
                    }
                    $(".selected").css("background-color", "red")
                }
            }

        }
    }
    let selectedIndex = $(".selected").index();
    if (selectedIndex == -1) {
        $(`.${tableClass} tr:last`).addClass("selectedLast");
        $(".selectedLast").css("background-color", "red");
    }


}

function buttonPreviousRow(tableClass) {
    if ($(`.${tableClass} tr`).hasClass("selectedLast")) {
        $(`.${tableClass} tr`).removeClass("selectedLast").css("background-color", "")
        $(`.${tableClass} tr`).closest("table").children("tr:last").addClass("selected");
    }
    if (!$(`.${tableClass} tr`).hasClass("selectedFirst")) {
        let table = document.querySelector(`.${tableClass}`);
        if ($(`.${tableClass}`).find('.selected').length == 0) {
            $(`.${tableClass} tr`).closest("table").children("tr:first").addClass("selected");
            $(".selected").css("background-color", "red")
        }
        else {
            if ($(`.${tableClass} td`).hasClass("selected")) {
                $(".selected").css({
                    "background-color": "",
                    "color": ""
                });
                $(".selected").removeClass("selected").closest("tr").prev().addClass("selected");
                $(".selected").css("background-color", "red")
            }
            else {
                let cell = table.getElementsByTagName("td");
                $(".selected").css("background-color", "");
                $(".selected").removeClass("selected").closest("tr").prev("tr").addClass("selected");
                for (let i = 0; i < cell.length; i++) {
                    if ($(`.${tableClass} tr`).hasClass("selected")) {
                        cell[i].style.backgroundColor = "";
                        cell[i].style.color = "black";
                    }
                }
                $(".selected").css("background-color", "red")
            }
        }
    }
    let selectedIndex = $(".selected").index();
    if (selectedIndex == 1) {
        $(`.${tableClass} tr`).eq(1).addClass("selectedFirst");
        $(".selectedFirst").css("background-color", "red");
        $(`.${tableClass} tr`).removeClass("selected");
    }

}

function buttonFirstRow(tableClass) {
    let table = document.querySelector(`.${tableClass}`);
    let cell = table.getElementsByTagName("td");
    if (!$(`.${tableClass} tr`).hasClass("selectedLast")) {
        $(".selected").css("background-color", "");
        $(`.${tableClass} tr`).removeClass("selected").closest("table").children("tr:first").addClass("selected");
        if ($(`.${tableClass} td`).hasClass("selected")) {
            $(".selected").removeClass("selected").css({
                "background-color": "",
                "color": ""
            })
            $(`.${tableClass} tr`).eq(1).addClass("selected");
            $(".selected").css("background-color", "red");
        }
        for (let i = 0; i < cell.length; i++) {
            if ($(`.${tableClass} tr`).hasClass("selected")) {
                cell[i].style.backgroundColor = "";
                cell[i].style.color = "black";
            }
        }
        $(".selected").css("background-color", "red")
    }
    else {
        $(`.${tableClass} tr`).removeClass("selectedLast").css("background-color", "");
        $(`.${tableClass} tr`).eq(1).addClass("selected");
        $(".selected").css("background-color", "red");
    }
}

function buttonLastRow(tableClass) {
    let table = document.querySelector(`.${tableClass}`);
    let cell = table.getElementsByTagName("td");
    if (!$(`.${tableClass} tr`).hasClass("selectedFirst")) {
        $(".selected").css("background-color", "");
        $(`.${tableClass} tr`).removeClass("selected").closest("table").children("tr:last").addClass("selected");
        if ($(`.${tableClass} td`).hasClass("selected")) {
            $(".selected").removeClass("selected").css({
                "background-color": "",
                "color": ""
            })
            $(`.${tableClass} tr`).closest("table").children("tr:last").addClass("selected");
            $(".selected").css("background-color", "red");
        }
        for (let i = 0; i < cell.length; i++) {
            if ($(`.${tableClass} tr`).hasClass("selected")) {
                cell[i].style.backgroundColor = "";
                cell[i].style.color = "black";
            }
        }
        $(".selected").css("background-color", "red")
    }
    else {
        $(`.${tableClass} tr`).removeClass("selectedFirst").css("background-color", "");;
        $(`.${tableClass} tr`).closest("table").children("tr:last").addClass("selected");
        $(".selected").css("background-color", "red");
    }
}

function closePopupWindow(popupWindowID) {
    $(`#${popupWindowID}`).css("display", "none");
}

//create a function that searches a product cell using the search box, and if it matches the entered value color all the cells that match

function searchBoxSearch(tableClass) {
    let valueOfSearchBox = $("#inputSearch").val()
    let table = document.querySelector(`.${tableClass}`)
    $(`.${table.className}`).find("tr").each(function () {
        $(this).find("td").eq(1).each(function () {
            //console.log(this.innerText)
            if (this.innerText == valueOfSearchBox) {
                this.style.backgroundColor = "green";
            }
        }) //this works make it maybe add a class to the found text?, but it does work as inteded
    })
    //finish this
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
    }) //this works on the second click, so it adds hi when i press the button a second time
}

//EVENTS
document.addEventListener("DOMContentLoaded", function () {
    newInvoicesTabOnLoad(true);
    nextInvoiceNumber();
    dateFormat();
    ddsClickChangeValue();
    clientsComboBoxOnLoad();
    paymentMethodComboBoxOnLoad();
    disabledButtonsCursor();
    productsComboBoxOnLoad();
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
    document.getElementById("btnNewInvoice").addEventListener("click", function () {
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
        searchBoxSearch("addedProducts");
    })
})
