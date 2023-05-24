SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `CustomersID` int(11) NOT NULL,
  `CustomerName` varchar(45) DEFAULT NULL,
  `CustomerAddress` varchar(45) DEFAULT NULL,
  `CustomerMOL` varchar(45) DEFAULT NULL,
  `CustomerECODE` varchar(45) DEFAULT NULL,
  `CustomerVATCODE` varchar(45) DEFAULT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `INVOICEID` int(11) NOT NULL,
  `INVOICENUMBER` varchar(45) DEFAULT NULL,
  `INVOICEVATDATE` varchar(45) DEFAULT NULL,
  `INVOICEDEALDATE` varchar(45) DEFAULT NULL,
  `INVOICESUM` decimal(20,2) DEFAULT NULL,
  `INVOICEVAT` decimal(20,2) DEFAULT NULL,
  `INVOICETOTAL` decimal(20,2) DEFAULT NULL,
  `INVOICEVATPERCENT` varchar(45) DEFAULT NULL,
  `CUSTOMERID` int(11) NOT NULL,
  `MYFIRMID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_product`
--

CREATE TABLE `invoice_product` (
  `INVPRODID` int(11) NOT NULL,
  `PRODUCTMEASURE` varchar(45) DEFAULT NULL,
  `PRODUCTUNITPRICE` varchar(45) DEFAULT NULL,
  `PRODUCTQUANTITY` varchar(45) NOT NULL DEFAULT '1',
  `INVOICEID` int(11) NOT NULL,
  `PRODUCTID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `myfirms`
--

CREATE TABLE `myfirms` (
  `MyFirmID` int(11) NOT NULL,
  `MyFirmName` varchar(45) DEFAULT NULL,
  `MyFirmAddress` varchar(45) DEFAULT NULL,
  `MyFirmMOL` varchar(45) DEFAULT NULL,
  `MyFirmECODE` varchar(45) DEFAULT NULL,
  `MyFirmVATECODE` varchar(45) DEFAULT NULL,
  `MyFirmIBAN` varchar(45) DEFAULT NULL,
  `MyFirmBANKNAME` varchar(45) DEFAULT NULL,
  `MyFirmBANKCODE` varchar(45) DEFAULT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `PRODUCTID` int(11) NOT NULL,
  `PRODUCTCODE` varchar(45) DEFAULT NULL,
  `PRODUCTNAME` varchar(45) DEFAULT NULL,
  `PRODUCTMEASURE` varchar(45) DEFAULT NULL,
  `QUANTITY` varchar(45) DEFAULT '1',
  `PRODUCT_DOST_CENA` varchar(45) DEFAULT NULL,
  `PRODUCT_PROD_CENA` varchar(45) DEFAULT NULL,
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`CustomersID`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`INVOICEID`,`CUSTOMERID`,`MYFIRMID`),
  ADD KEY `fk_INVOICES_Customers_idx` (`CUSTOMERID`),
  ADD KEY `fk_INVOICES_MYFIRMS1_idx` (`MYFIRMID`);

--
-- Indexes for table `invoice_product`
--
ALTER TABLE `invoice_product`
  ADD PRIMARY KEY (`INVPRODID`,`INVOICEID`,`PRODUCTID`),
  ADD KEY `fk_INVOICE_PRODUCT_INVOICES1_idx` (`INVOICEID`),
  ADD KEY `fk_INVOICE_PRODUCT_PRODUCTS1_idx` (`PRODUCTID`);

--
-- Indexes for table `myfirms`
--
ALTER TABLE `myfirms`
  ADD PRIMARY KEY (`MyFirmID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`PRODUCTID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `fk_INVOICES_Customers` FOREIGN KEY (`CUSTOMERID`) REFERENCES `customers` (`CustomersID`),
  ADD CONSTRAINT `fk_INVOICES_MYFIRMS1` FOREIGN KEY (`MYFIRMID`) REFERENCES `myfirms` (`MyFirmID`);

--
-- Constraints for table `invoice_product`
--
ALTER TABLE `invoice_product`
  ADD CONSTRAINT `fk_INVOICE_PRODUCT_INVOICES1` FOREIGN KEY (`INVOICEID`) REFERENCES `invoices` (`INVOICEID`),
  ADD CONSTRAINT `fk_INVOICE_PRODUCT_PRODUCTS1` FOREIGN KEY (`PRODUCTID`) REFERENCES `products` (`PRODUCTID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
