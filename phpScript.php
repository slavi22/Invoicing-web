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
    function hi(){
        echo "hi";
    }

    function InvoicesViewInvoiceProuducts($id){
        $query = "select p.PRODUCTCODE as \"Код\", p.productname as \"Наименование на продукт\", p.PRODUCTMEASURE as \"Мярка\", ip.INVOICEQUANTITY as \"Количество\", p.PRODUCT_PROD_CENA as \"Сума\" from invoice_product ip join products p on(ip.PRODUCTID = p.PRODUCTID) join invoices i on(ip.INVOICEID = i.INVOICEID) where i.INVOICENUMBER = {$id}";
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
    function ClientsComboBoxOnLoad(){
        $query = "SELECT CustomersID, CustomerName FROM customers";
        $result = $GLOBALS['conn'] -> query($query);
        while($row=$result -> fetch_assoc()){
            echo
            "<option value='".$row["CustomersID"]."'>".$row["CustomerName"]."</option>";
        }
    }

    function ProductsComboBoxOnLoad(){
        $query = "SELECT PRODUCTCODE, PRODUCTNAME FROM products";
        $result = $GLOBALS['conn'] -> query($query);
        while($row=$result -> fetch_assoc()){
            echo
            "<option value='".$row["PRODUCTCODE"]."'>".$row["PRODUCTNAME"]."</option>";
        }
    }

    function AddSelectedProductToGrid($selectedIndex){
        $query = "SELECT p.PRODUCTCODE, p.PRODUCTNAME, p.PRODUCTMEASURE, p.QUANTITY, p.PRODUCT_DOST_CENA FROM products p WHERE PRODUCTCODE={$selectedIndex}+1";
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


    //CALLS
    //https://stackoverflow.com/questions/2269307/using-jquery-ajax-to-call-a-php-function
    if(isset($_GET['function'])){
        if($_GET['function'] == 'hi'){
            hi();
        }
        elseif($_GET['function'] == 'InvoicesDBOnLoad'){
            InvoicesDBOnLoad();
        }
        elseif($_GET['function'] == 'NextInvoiceNumber'){
            NextInvoiceNumber();
        }
        elseif($_GET['function'] == 'ClientsComboBoxOnLoad'){
            ClientsComboBoxOnLoad();
        }
        elseif($_GET['function'] == 'ProductsComboBoxOnLoad'){
            ProductsComboBoxOnLoad();
        }
    }

    if(isset($_POST['id'])){
        $id = $_POST['id'];
        InvoicesViewInvoiceProuducts($id);
    }

    if(isset($_POST['selectedIndex'])){
        $selectedIndex = $_POST['selectedIndex'];
        AddSelectedProductToGrid($selectedIndex);
    }

    // if( $_SERVER['REQUEST_METHOD']=='POST'){
    //      $id = $_POST['id'];
    //      InvoicesViewInvoiceProuducts($id);
    // }

?>
