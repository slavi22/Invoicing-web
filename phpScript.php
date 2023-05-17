<?php

    $connConfig = parse_ini_file('./connection.ini');
    $conn = new mysqli($connConfig['DB_ADDRESS'], $connConfig['DB_USER'], $connConfig['DB_PASS'], $connConfig['DB_NAME'], $connConfig['DB_PORT']);

    //https://www.reddit.com/r/PHPhelp/comments/imop53/how_can_i_hide_sensitive_data_like_database/ -> this is a good idea on how to hide credentials from the db
    //https://stackoverflow.com/questions/14752470/creating-a-config-file-in-php -> thats the one i ended up using

    function InvoicesDBOnLoad(){
        $sql = "SELECT  INVOICENUMBER as \"Фактура\", MyFirmName as \"Фирма\", INVOICEVATDATE as \"Дата\", INVOICESUM as \"Дан. основа\", INVOICEVAT as \"ДДС\", INVOICETOTAL as \"Общо\" from invoices join myfirms on (myfirms.myfirmid = invoices.myfirmid) order by INVOICENUMBER asc";
        $result = $GLOBALS['conn'] -> query($sql);
        while($row = $result -> fetch_assoc()){
        echo 
        "
            <tr>
            <td>".$row["Фактура"]."</td>
            <td>".$row["Фирма"]."</td>
            <td>".$row["Дата"]."</td>
            <td>".$row["Дан. основа"]."</td>
            <td>".$row["ДДС"]."</td>
            <td>".$row["Общо"]."</td>
            </tr>
        ";
        }
    }

    function InvoicesViewInvoiceProuducts($invoiceNumber){
        $query = "select p.PRODUCTCODE as \"Код\", p.productname as \"Наименование на продукт\", p.PRODUCTMEASURE as \"Мярка\", ip.PRODUCTQUANTITY as \"Количество\", p.PRODUCT_PROD_CENA as \"Сума\" from invoice_product ip join products p on(ip.PRODUCTID = p.PRODUCTID) join invoices i on(ip.INVOICEID = i.INVOICEID) where i.INVOICENUMBER = $invoiceNumber";
        $result = $GLOBALS['conn'] -> query($query);
        while ($row = $result -> fetch_assoc()) {
            echo
            "
                <tr>
                <td>".$row["Код"]."</td>
                <td>".$row["Наименование на продукт"]."</td>
                <td>".$row["Мярка"]."</td>
                <td>".$row["Количество"]."</td>
                <td>".$row["Сума"]."</td>
                </tr>
            ";
        }
    }
    function NextInvoiceNumber(){
        $query = "SELECT INVOICENUMBER FROM mydb.invoices order by INVOICENUMBER desc limit 1;";
        $result = $GLOBALS['conn'] -> query($query);
        while($row = $result -> fetch_assoc()){
            echo
            "".$row['INVOICENUMBER']."";
        }
    }
    function FirmsComboBoxOnLoad(){
        $query = "SELECT MyFirmID, MyFirmName FROM myfirms";
        $result = $GLOBALS['conn'] -> query($query);
        while($row=$result -> fetch_assoc()){
            echo
            "<option value='".$row["MyFirmID"]."'>".$row["MyFirmName"]."</option>";
        }
    }

    function ClientsComboBoxOnLoad(){
        $query = "SELECT CustomersID, CustomerName FROM customers";
        $result = $GLOBALS['conn'] -> query($query);
        while($row=$result -> fetch_assoc()){
            echo
            "<option value='".$row["CustomersID"]."'>".$row["CustomerName"]."</option>";
        }
    }

    function ProductsComboBoxOnLoad(){
        $query = "SELECT PRODUCTCODE, PRODUCTNAME FROM products WHERE IsDeleted = 0";
        $result = $GLOBALS['conn'] -> query($query);
        while($row=$result -> fetch_assoc()){
            echo
            "<option value='".$row["PRODUCTCODE"]."'>".$row["PRODUCTNAME"]."</option>";
        }
    }

    function AddSelectedProductToGrid($selectedIndex){
        $query = "SELECT p.PRODUCTCODE, p.PRODUCTNAME, p.PRODUCTMEASURE, p.QUANTITY, p.PRODUCT_DOST_CENA FROM products p WHERE PRODUCTCODE = $selectedIndex+1";
        $result = $GLOBALS['conn'] -> query($query);
        while ($row = $result -> fetch_assoc()) {
            echo
            "
                <tr>
                <td>".$row["PRODUCTCODE"]."</td>
                <td>".$row["PRODUCTNAME"]."</td>
                <td>".$row["PRODUCTMEASURE"]."</td>
                <td>".$row["QUANTITY"]."</td>
                <td>".$row["PRODUCT_DOST_CENA"]."</td>
                </tr>
            ";
        }
    }

    function AddNewInvoiceToDb($invoiceNumber, $invoiceVATDate, $invoiceDealDate, $invoiceSum, $invoiceVat, $invoiceTotal, $invoiceVatPercent, $customerId, $myFirmId){
        $query = "INSERT INTO `invoices` (`INVOICEID`, `INVOICENUMBER`, `INVOICEVATDATE`, `INVOICEDEALDATE`, `INVOICESUM`, `INVOICEVAT`, `INVOICETOTAL`, `INVOICEVATPERCENT`, `CUSTOMERID`, `MYFIRMID`) VALUES ('$invoiceNumber', '$invoiceNumber', '$invoiceVATDate', '$invoiceDealDate', '$invoiceSum', '$invoiceVat', '$invoiceTotal', '$invoiceVatPercent', '$customerId', '$myFirmId')";
        $GLOBALS['conn'] -> query($query);
    }

    function GetPrintPreviewRecipientInfo($customerId){
        $query = "SELECT CustomerECODE, CustomerVATCODE, CustomerAddress, CustomerMOL FROM `customers` WHERE CustomersID = $customerId+1";
        $result = $GLOBALS['conn'] -> query($query);
        $array = array();
        while($row = $result -> fetch_assoc()){
            $array[] = $row;
        }
        echo json_encode($array, JSON_UNESCAPED_UNICODE);
    }

    function GetPrintPreviewSellerInfo($myFirmId){
        $query = "SELECT MyFirmName, MyFirmECODE, MyFirmVATECODE, MyFirmAddress, MyFirmMOL FROM `myfirms` WHERE MyFirmId = $myFirmId+1";
        $result = $GLOBALS['conn'] -> query($query);
        $array = array();
        while($row = $result -> fetch_assoc()){
            $array[] = $row;
        }
        echo json_encode($array, JSON_UNESCAPED_UNICODE);
    }

    function GetPrintPreviewDatesInfo($customerId){
        $query = "SELECT customers.CustomerAddress FROM `customers` WHERE customers.CustomersID = $customerId+1";
        $result = $GLOBALS['conn'] -> query($query);
        $array = array();
        while($row = $result -> fetch_assoc()){
            $array[] = $row;
        }
        echo json_encode($array, JSON_UNESCAPED_UNICODE);
    }

    function SellerBankInfo($sellerId){
        $query = "SELECT MyFirmID, MyFirmBANKNAME, MyFirmIBAN, MyFirmBANKCODE FROM `myfirms` WHERE MyFirmID = $sellerId+1";
        $result = $GLOBALS['conn'] -> query($query);
        $array = array();
        while($row = $result -> fetch_assoc()){
            $array[] = $row;
        }
        echo json_encode($array, JSON_UNESCAPED_UNICODE);
    }

    function ProtocolDataInfo($id){
        $query = "SELECT MyFirmID, MyFirmMOL, MyFirmECODE FROM myfirms WHERE myfirms.MyFirmID = $id+1";
        $result = $GLOBALS['conn'] -> query($query);
        $array = array();
        while($row = $result -> fetch_assoc()){
            $array[] = $row;
        }
        echo json_encode($array, JSON_UNESCAPED_UNICODE);
    }

    function GetLastInvoiceProductID(){
        $query = "SELECT INVPRODID FROM invoice_product order by INVPRODID desc limit 1";
        $result = $GLOBALS['conn'] -> query($query);
        $array = array();
        while($row = $result -> fetch_assoc()){
            $array[] = $row;
        }
        echo json_encode($array, JSON_UNESCAPED_UNICODE);
    }

    function AddDataToInvoiceProduct($invProdID, $productQuantity, $invoiceID, $productID){
        $query = "INSERT INTO `invoice_product` (`INVPRODID`, `PRODUCTMEASURE`, `PRODUCTUNITPRICE`, `PRODUCTQUANTITY`, `INVOICEID`, `PRODUCTID`) SELECT $invProdID+1, products.PRODUCTMEASURE, products.PRODUCT_PROD_CENA, $productQuantity, $invoiceID, $productID FROM products WHERE products.PRODUCTID=$productID"; //invprodid - ot ajaxa, quantity ot kletkata v tablicata, invoice id ot ajax i productid ot kletkata v tablicata
        $GLOBALS['conn'] -> query($query);
    }


    //CALLS
    //https://stackoverflow.com/questions/2269307/using-jquery-ajax-to-call-a-php-function
    if(isset($_GET['function'])){
        if($_GET['function'] == 'InvoicesDBOnLoad'){
            InvoicesDBOnLoad();
        }
        elseif($_GET['function'] == 'NextInvoiceNumber'){
            NextInvoiceNumber();
        }
        elseif($_GET['function'] == 'FirmsComboBoxOnLoad'){
            FirmsComboBoxOnLoad();
        }
        elseif($_GET['function'] == "ClientsComboBoxOnLoad"){
            ClientsComboBoxOnLoad();
        }
        elseif($_GET['function'] == 'ProductsComboBoxOnLoad'){
            ProductsComboBoxOnLoad();
        }  
        elseif($_GET['function'] == 'GetLastInvoiceProductID'){
            GetLastInvoiceProductID();
        }   
    }

    if(isset($_POST['function'])){
        if($_POST['function'] == "InvoicesViewInvoiceProuducts"){
            $invoiceNumber = $_POST['invoiceNumber'];
            InvoicesViewInvoiceProuducts($invoiceNumber);
        }
        else if($_POST['function'] == "AddSelectedProductToGrid"){
            $selectedIndex = $_POST['selectedIndex'];
            AddSelectedProductToGrid($selectedIndex);
        }
        else if($_POST['function'] == 'AddNewInvoiceToDb'){
            $invoiceNumber = $_POST['invoiceNumber'];
            $invoiceVATDate = $_POST['invoiceVATDate'];
            $invoiceDealDate = $_POST['invoiceDealDate'];
            $invoiceSum = $_POST['invoiceSum'];
            $invoiceVat = $_POST['invoiceVat'];
            $invoiceTotal = $_POST['invoiceTotal'];
            $invoiceVatPercent = $_POST['invoiceVatPercent'];
            $customerId = $_POST['customerId'];
            $myFirmId = $_POST['myFirmId'];
            AddNewInvoiceToDb($invoiceNumber, $invoiceVATDate, $invoiceDealDate, $invoiceSum, $invoiceVat, $invoiceTotal, $invoiceVatPercent, $customerId+1, $myFirmId+1);
        }
        elseif($_POST['function'] == "GetPrintPreviewRecipientInfo"){
            GetPrintPreviewRecipientInfo($_POST['customerId']);
        }
        elseif($_POST['function'] == "GetPrintPreviewSellerInfo"){
            GetPrintPreviewSellerInfo($_POST['myFirmId']);
        }   
        elseif($_POST['function'] == "GetPrintPreviewDatesInfo"){
            GetPrintPreviewDatesInfo($_POST['customerId']);
        }
        elseif($_POST['function'] == "SellerBankInfo"){
            SellerBankInfo($_POST['sellerId']);
        }
        elseif($_POST['function'] == "ProtocolDataInfo"){
            ProtocolDataInfo($_POST['id']);
        }
        elseif($_POST['function'] == "AddDataToInvoiceProduct"){
            AddDataToInvoiceProduct($_POST['invProdID'], $_POST['productQuantity'], $_POST['invoiceID'], $_POST['productID']);
        }
    }
?>
