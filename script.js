/*https://www.w3schools.com/howto/howto_js_tabs.asp*/
function tabControl(evt, loadTab) {
    let i, tabControlButton, tab;

    //hide everything, could be used on load
    tabControlButton = document.getElementsByClassName("tab")
    for (i = 0; i < tabControlButton.length; i++) {
        tabControlButton[i].style.display = "none";
    }

    //hide the "active"(current) window
    tab = document.getElementsByClassName("tab");
    for (i = 0; i < tab.length; i++) {
        tab[i].className = tab[i].className.replace(" active", "");
    }

    //show the tab i clicked on and make it "active"
    document.getElementById(loadTab).style.display = "grid";
    evt.currentTarget.className += " active";
}

function setAutoHeight(childToBeAdjusted) {
    let parentDivHeight = document.querySelector(".newInvoice").clientHeight;
    let adjust = document.querySelector(`.${childToBeAdjusted}`).clientHeight; //dumbass js....
    if (adjust < parentDivHeight) {
        document.querySelector(`.${childToBeAdjusted}`).style.height = `${parentDivHeight}px`;
    }

}


//disable double clicking
document.addEventListener("mousedown", function (e) {
    if (e.detail > 1) {
        e.preventDefault();
    }
})

//add a selected class on the new invoice tab's datagrid's cells
$(document).ready(function () {
    $('.addedProducts td').click(function () {
        $('.selected').each(function () {
            $(this).removeClass('selected')
        });
        $(this).addClass('selected');
    });
});


function colorCells() {
    let table = document.querySelector(".addedProducts")
    let td = table.getElementsByTagName("td");
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

document.addEventListener("DOMContentLoaded", function (e) {
    e.target.addEventListener("click", colorCells)
})

function InvoicesGridAddSelectedClass() {
    $('.invoicesInDB tr').click(function () {
        $('.selectedRow').each(function () {
            $(this).removeClass('selectedRow')
        });
        $(this).addClass('selectedRow');
    });
}

document.addEventListener("DOMContentLoaded", function (e) {
    e.target.addEventListener("click", InvoicesGridAddSelectedClass)
})

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

document.addEventListener("DOMContentLoaded", function (e) {
    e.target.addEventListener("click", colorRow)
})

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
function tdClick() {
    let id = number;
    $.ajax({
        url: 'phpScript.php',
        type: "POST",
        data: { id: id },
        success: function (res) {
            //alert(res)
            $(".selectedCellInfo tr:eq(1)").remove();
            $(".selectedCellInfo").append(res);
            $(".selectedCellInfo td:eq(1)").width("25%")

        }
    })
}



function clickedRowNumber() {
    let table = document.querySelector(".invoicesDataGridShowInvoices")
    let tr = table.getElementsByTagName("tr");
    for (let i = 1; i < tr.length; i++) {
        if (tr[i].classList.contains("selectedRow")) {
            number = tr[i].children[0].innerText;
        }
    }
}












