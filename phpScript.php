<?php

    $connConfig = parse_ini_file('./connection.ini');
    $conn = new mysqli($connConfig['DB_ADDRESS'], $connConfig['DB_USER'], $connConfig['DB_PASS'], $connConfig['DB_NAME'], $connConfig['DB_PORT']);

    //https://www.reddit.com/r/PHPhelp/comments/imop53/how_can_i_hide_sensitive_data_like_database/ -> this is a good idea on how to hide credentials from the db
    //https://stackoverflow.com/questions/14752470/creating-a-config-file-in-php -> thats the one i ended up using


    //INVOICES TAB
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
        $query = "select p.PRODUCTCODE as \"Код\", p.productname as \"Наименование на продукт\", p.PRODUCTMEASURE as \"Мярка\", ip.PRODUCTQUANTITY as \"Количество\", p.PRODUCT_DOST_CENA as \"Сума\" from invoice_product ip join products p on(ip.PRODUCTID = p.PRODUCTID) join invoices i on(ip.INVOICEID = i.INVOICEID) where i.INVOICENUMBER = $invoiceNumber";
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

    // NEW INVOICE TAB
    function NextInvoiceNumber(){
        $query = "SELECT INVOICENUMBER FROM mydb.invoices order by INVOICENUMBER desc limit 1;";
        $result = $GLOBALS['conn'] -> query($query);
        while($row = $result -> fetch_assoc()){
            echo
            "".$row['INVOICENUMBER']."";
        }
    }
    function FirmsComboBoxOnLoad(){
        $query = "SELECT MyFirmID, MyFirmName FROM myfirms WHERE IsDeleted = 0";
        $result = $GLOBALS['conn'] -> query($query);
        while($row=$result -> fetch_assoc()){
            echo
            "<option value='".$row["MyFirmID"]."'>".$row["MyFirmName"]."</option>";
        }
    }

    function ClientsComboBoxOnLoad(){
        $query = "SELECT CustomersID, CustomerName FROM customers WHERE IsDeleted = 0";
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

    function ProductsComboBoxGetSelectedOptionID($selectedOption){
        $query = "SELECT PRODUCTID from products WHERE PRODUCTNAME = '$selectedOption'";
        $result = $GLOBALS['conn'] -> query($query);
        $array = array();
        while($row = $result -> fetch_assoc()){
            $array[] = $row;
        }
        echo json_encode($array, JSON_UNESCAPED_UNICODE);
    }

    function AddSelectedProductToGrid($productID){
        $query = "SELECT p.PRODUCTCODE, p.PRODUCTNAME, p.PRODUCTMEASURE, p.QUANTITY, p.PRODUCT_DOST_CENA FROM products p WHERE PRODUCTCODE = $productID";
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

    function AddNewInvoiceToDb($invoiceNumber, $invoiceVATDate, $invoiceDealDate, $invoiceSum, $invoiceVat, $invoiceTotal, $invoiceVatPercent, $customerId, $firmId){
        $query = "INSERT INTO `invoices` (`INVOICEID`, `INVOICENUMBER`, `INVOICEVATDATE`, `INVOICEDEALDATE`, `INVOICESUM`, `INVOICEVAT`, `INVOICETOTAL`, `INVOICEVATPERCENT`, `CUSTOMERID`, `MYFIRMID`) VALUES ('$invoiceNumber', '$invoiceNumber', '$invoiceVATDate', '$invoiceDealDate', '$invoiceSum', '$invoiceVat', '$invoiceTotal', '$invoiceVatPercent', '$customerId', '$firmId')";
        $GLOBALS['conn'] -> query($query);
    }

    function GetCustomerIDAndFirmID($clientComboBoxSelectedOption, $firmComboBoxSelectedOption){
        $query = "SELECT customers.CustomersID, myfirms.MyFirmID FROM `customers`, `myfirms` WHERE customers.CustomerName = '$clientComboBoxSelectedOption' AND myfirms.MyFirmName = '$firmComboBoxSelectedOption'";
        $result = $GLOBALS['conn'] -> query($query);
        $array = array();
        while($row = $result -> fetch_assoc()){
            $array[] = $row;
        }
        echo json_encode($array, JSON_UNESCAPED_UNICODE);
    }

    function GetPrintPreviewRecipientInfo($customerId){
        $query = "SELECT CustomerECODE, CustomerVATCODE, CustomerAddress, CustomerMOL FROM `customers` WHERE CustomersID = $customerId";
        $result = $GLOBALS['conn'] -> query($query);
        $array = array();
        while($row = $result -> fetch_assoc()){
            $array[] = $row;
        }
        echo json_encode($array, JSON_UNESCAPED_UNICODE);
    }

    function GetPrintPreviewSellerInfo($myFirmId){
        $query = "SELECT MyFirmName, MyFirmECODE, MyFirmVATECODE, MyFirmAddress, MyFirmMOL FROM `myfirms` WHERE MyFirmId = $myFirmId";
        $result = $GLOBALS['conn'] -> query($query);
        $array = array();
        while($row = $result -> fetch_assoc()){
            $array[] = $row;
        }
        echo json_encode($array, JSON_UNESCAPED_UNICODE);
    }

    function GetPrintPreviewDatesInfo($customerId){
        $query = "SELECT customers.CustomerAddress FROM `customers` WHERE customers.CustomersID = $customerId";
        $result = $GLOBALS['conn'] -> query($query);
        $array = array();
        while($row = $result -> fetch_assoc()){
            $array[] = $row;
        }
        echo json_encode($array, JSON_UNESCAPED_UNICODE);
    }

    function SellerBankInfo($sellerId){
        $query = "SELECT MyFirmID, MyFirmBANKNAME, MyFirmIBAN, MyFirmBANKCODE FROM `myfirms` WHERE MyFirmID = $sellerId";
        $result = $GLOBALS['conn'] -> query($query);
        $array = array();
        while($row = $result -> fetch_assoc()){
            $array[] = $row;
        }
        echo json_encode($array, JSON_UNESCAPED_UNICODE);
    }

    function ProtocolDataInfo($id){
        $query = "SELECT MyFirmID, MyFirmMOL, MyFirmECODE FROM myfirms WHERE myfirms.MyFirmID = $id";
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
        $query = "INSERT INTO `invoice_product` (`INVPRODID`, `PRODUCTMEASURE`, `PRODUCTUNITPRICE`, `PRODUCTQUANTITY`, `INVOICEID`, `PRODUCTID`) SELECT $invProdID, products.PRODUCTMEASURE, products.PRODUCT_DOST_CENA, $productQuantity, $invoiceID, $productID FROM products WHERE products.PRODUCTID=$productID";
        $GLOBALS['conn'] -> query($query);
    }


    //PRODUCTS TAB
    function ProductsTableOnLoad(){
        $query = "SELECT PRODUCTCODE, PRODUCTNAME, PRODUCTMEASURE, QUANTITY, PRODUCT_DOST_CENA, PRODUCT_PROD_CENA FROM `products` WHERE IsDeleted = 0";
        $result = $GLOBALS['conn'] -> query($query);
        while($row = $result -> fetch_assoc()){
            echo
            "
                <tr>
                <td>".$row["PRODUCTCODE"]."</td>
                <td>".$row["PRODUCTNAME"]."</td>
                <td>".$row["PRODUCTMEASURE"]."</td>
                <td>".$row["QUANTITY"]."</td>
                <td>".$row["PRODUCT_DOST_CENA"]."</td>
                <td>".$row["PRODUCT_PROD_CENA"]."</td>
                </tr>
            ";
        }
    }
    
    function AddProductsToDB($id, $code, $name, $measure, $quantity, $dostCena, $prodCena){
        $query = "INSERT INTO `products` (`PRODUCTID`, `PRODUCTCODE`, `PRODUCTNAME`, `PRODUCTMEASURE`, `QUANTITY`, `PRODUCT_DOST_CENA`, `PRODUCT_PROD_CENA`, `IsDeleted`) VALUES ('$id', '$code', '$name', '$measure', '$quantity', '$dostCena', '$prodCena', '0') ON DUPLICATE KEY UPDATE PRODUCTID = PRODUCTID";
        $GLOBALS['conn'] -> query($query);
    }

    function EditProductInDB($id, $code, $name, $measure, $quantity, $dostCena, $prodCena){
        $query = "UPDATE products SET ProductID = '$code', ProductCode = '$code', ProductName = '$name', ProductMeasure = '$measure', Quantity = '$quantity', Product_Dost_Cena = '$dostCena', Product_Prod_Cena = '$prodCena', IsDeleted = '0' WHERE ProductID = $id";
        $GLOBALS['conn'] -> query($query);
    }

    function ProductsDeleteProduct($code){
        $query = "UPDATE products SET IsDeleted = 1 WHERE ProductCode = $code";
        $GLOBALS['conn'] -> query($query);
    }

    //CUSTOMERS TAB

    function CustomersTableOnLoad(){
        $query = "SELECT CustomersID, CustomerName, CustomerAddress, CustomerMOL, CustomerECODE, CustomerVATCODE FROM `customers` WHERE IsDeleted = 0";
        $result = $GLOBALS['conn'] -> query($query);
        while($row = $result -> fetch_assoc()){
            echo
            "
                <tr>
                <td>".$row["CustomersID"]."</td>
                <td>".$row["CustomerName"]."</td>
                <td>".$row["CustomerAddress"]."</td>
                <td>".$row["CustomerMOL"]."</td>
                <td>".$row["CustomerECODE"]."</td>
                <td>".$row["CustomerVATCODE"]."</td>
                </tr>
            ";
        }
    }

    function AddCustomersToDB($id, $name, $address, $mol, $ecode, $vatcode){
        $query =  "INSERT INTO `customers`(`CustomersID`, `CustomerName`, `CustomerAddress`, `CustomerMOL`, `CustomerECODE`, `CustomerVATCODE`) VALUES ('$id','$name','$address','$mol','$ecode','$vatcode')";
        $GLOBALS['conn'] -> query($query);
    }

    function EditCustomersInDB($id, $editId, $name, $address, $mol, $ecode, $zdds){
        $query = "UPDATE `customers` SET `CustomersID`='$editId',`CustomerName`='$name',`CustomerAddress`='$address',`CustomerMOL`='$mol',`CustomerECODE`='$ecode',`CustomerVATCODE`='$zdds',`IsDeleted`='0' WHERE CustomersID = $id";
        $GLOBALS['conn'] -> query($query);
    }

    function CustomersDeleteCustomer($code){
        $query = "UPDATE customers SET IsDeleted = 1 WHERE CustomersID = $code";
        $GLOBALS['conn'] -> query($query);
    }

    //FIRMS TAB

    function FirmsTableOnLoad(){
        $query = "SELECT `MyFirmID`, `MyFirmName`, `MyFirmAddress`, `MyFirmMOL`, `MyFirmECODE`, `MyFirmVATECODE`, `MyFirmIBAN`, `MyFirmBANKNAME`, `MyFirmBANKCODE` FROM `myfirms` WHERE IsDeleted = 0";
        $result = $GLOBALS['conn'] -> query($query);
        while($row = $result -> fetch_assoc()){
            echo
            "
                <tr>
                <td>".$row["MyFirmID"]."</td>
                <td>".$row["MyFirmName"]."</td>
                <td>".$row["MyFirmAddress"]."</td>
                <td>".$row["MyFirmMOL"]."</td>
                <td>".$row["MyFirmECODE"]."</td>
                <td>".$row["MyFirmVATECODE"]."</td>
                <td>".$row["MyFirmIBAN"]."</td>
                <td>".$row["MyFirmBANKNAME"]."</td>
                <td>".$row["MyFirmBANKCODE"]."</td>
                </tr>
            ";
        }
    }

    function AddFirmsToDB($id, $name, $address, $mol, $ecode, $vatcode, $iban, $bankName, $bankCode){
        $query = "INSERT INTO `myfirms`(`MyFirmID`, `MyFirmName`, `MyFirmAddress`, `MyFirmMOL`, `MyFirmECODE`, `MyFirmVATECODE`, `MyFirmIBAN`, `MyFirmBANKNAME`, `MyFirmBANKCODE`) VALUES ('$id','$name','$address','$mol','$ecode','$vatcode','$iban','$bankName','$bankCode')";
        $GLOBALS['conn'] -> query($query);
    }

    function EditFirmsInDB($id, $editId, $name, $address, $mol, $ecode, $zdds, $iban, $bankName, $bankCode){
        $query = "UPDATE `myfirms` SET `MyFirmID`='$editId',`MyFirmName`='$name',`MyFirmAddress`='$address',`MyFirmMOL`='$mol',`MyFirmECODE`='$ecode',`MyFirmVATECODE`='$zdds',`MyFirmIBAN`='$iban',`MyFirmBANKNAME`='$bankName',`MyFirmBANKCODE`='$bankCode' WHERE MyFirmID = $id";
        $GLOBALS['conn'] -> query($query);
    }

    function FirmsDeleteFirm($id){
        $query = "UPDATE myfirms SET IsDeleted = 1 WHERE MyFirmID = $id";
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
        elseif($_GET['function'] == 'ProductsTableOnLoad'){
            ProductsTableOnLoad();
        }
        elseif($_GET['function'] == 'CustomersTableOnLoad'){
            CustomersTableOnLoad();
        }
        elseif($_GET['function'] == 'FirmsTableOnLoad'){
            FirmsTableOnLoad();
        }
    }

    if(isset($_POST['function'])){
        if($_POST['function'] == "InvoicesViewInvoiceProuducts"){
            $invoiceNumber = $_POST['invoiceNumber'];
            InvoicesViewInvoiceProuducts($invoiceNumber);
        }
        else if($_POST['function'] == "AddSelectedProductToGrid"){
            AddSelectedProductToGrid($_POST['productID']);
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
            $firmId = $_POST['firmId'];
            AddNewInvoiceToDb($invoiceNumber, $invoiceVATDate, $invoiceDealDate, $invoiceSum, $invoiceVat, $invoiceTotal, $invoiceVatPercent, $customerId, $firmId);
        }
        else if($_POST['function'] == "GetCustomerIDAndFirmID"){
            GetCustomerIDAndFirmID($_POST['clientComboBoxSelectedOption'], $_POST['firmComboBoxSelectedOption']);
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
        elseif($_POST['function'] == "AddProductsToDB"){
            AddProductsToDB($_POST['id'], $_POST['code'], $_POST['name'], $_POST['measure'], $_POST['quantity'], $_POST['dostCena'], $_POST['prodCena']);
        }
        elseif($_POST['function'] == "EditProductInDB"){
            EditProductInDB($_POST['id'], $_POST['code'], $_POST['name'], $_POST['measure'], $_POST['quantity'], $_POST['dostCena'], $_POST['prodCena']);
        }
        elseif($_POST['function'] == "ProductsDeleteProduct"){
            ProductsDeleteProduct($_POST['code']);
        }
        elseif($_POST['function'] == "AddCustomersToDB"){
            AddCustomersToDB($_POST['id'], $_POST['name'], $_POST['address'], $_POST['mol'], $_POST['ecode'], $_POST['vatcode']);
        }
        elseif($_POST['function'] == "EditCustomersInDB"){
            EditCustomersInDB($_POST['id'], $_POST['editId'], $_POST['name'], $_POST['address'], $_POST['mol'], $_POST['ecode'], $_POST['zdds']);
        }
        elseif($_POST['function'] == "CustomersDeleteCustomer"){
            CustomersDeleteCustomer($_POST['code']);
        }
        elseif($_POST['function'] == "AddFirmsToDB"){
            AddFirmsToDB($_POST['id'], $_POST['name'], $_POST['address'], $_POST['mol'], $_POST['ecode'], $_POST['vatcode'], $_POST['iban'], $_POST['bankName'], $_POST['bankCode']);
        }
        elseif($_POST['function'] == "EditFirmsInDB"){
            EditFirmsInDB($_POST['id'], $_POST['editId'], $_POST['name'], $_POST['address'], $_POST['mol'], $_POST['ecode'], $_POST['zdds'], $_POST['iban'], $_POST['bankName'], $_POST['bankCode']);
        }
        elseif($_POST['function'] == "FirmsDeleteFirm"){
            FirmsDeleteFirm($_POST['id']);
        }
        elseif($_POST['function'] == "ProductsComboBoxGetSelectedOptionID"){
            ProductsComboBoxGetSelectedOptionID($_POST['selectedOption']);
        }
    }
?>
