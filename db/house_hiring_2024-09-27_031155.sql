-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: house_hiring
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `email` varchar(255) DEFAULT NULL COMMENT 'email address',
  `pwd` varchar(255) DEFAULT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Date and Time of Creation',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='administration_table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `owner`
--

DROP TABLE IF EXISTS `owner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `owner` (
  `lastname` varchar(255) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `pwd` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contactmoov` varchar(25) DEFAULT NULL,
  `contacttg` varchar(25) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL COMMENT 'Create Time',
  `sold` double DEFAULT NULL,
  `img_url` varchar(255) DEFAULT NULL COMMENT 'owner signature url',
  `next_billing_date` date DEFAULT NULL COMMENT 'Next Billing Date',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `contactmoov` (`contactmoov`,`contacttg`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='owner_table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment_received`
--

DROP TABLE IF EXISTS `payment_received`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_received` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `property_tenantid` int DEFAULT NULL,
  `sumpayed` double DEFAULT NULL COMMENT 'Total Amount Paid',
  `accessory_fees` double DEFAULT NULL COMMENT 'Property extra fee',
  `amount_due` double DEFAULT NULL COMMENT 'Property price',
  `monthpayed` date NOT NULL COMMENT 'Month of Payment',
  `payment_state` int DEFAULT '0' COMMENT 'Payment State',
  `ref` double DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL COMMENT 'FLOOZ or TMONEY',
  `unpaid_months_count` int DEFAULT NULL COMMENT 'unpaid months count',
  `unpaid_months` varchar(255) DEFAULT NULL COMMENT 'unpaid months',
  `rest_amount_due` double DEFAULT NULL COMMENT 'rest amount due',
  `isviewedbyowner` tinyint(1) DEFAULT '1' COMMENT 'Viewed by Owner (0=No, 1=Yes)',
  `isviewedbytenant` tinyint(1) DEFAULT '1' COMMENT 'Viewed by Tenant (0=No, 1=Yes)',
  `validation_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'validation date',
  `create_time` datetime DEFAULT NULL COMMENT 'Date and Time of Creation',
  PRIMARY KEY (`id`),
  UNIQUE KEY `monthpayed_2` (`monthpayed`,`property_tenantid`),
  KEY `property_tenantid` (`property_tenantid`),
  KEY `monthpayed` (`monthpayed`,`ref`,`method`),
  CONSTRAINT `payment_received_ibfk_1` FOREIGN KEY (`property_tenantid`) REFERENCES `property_tenant` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=238 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='payment_received_table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `property`
--

DROP TABLE IF EXISTS `property`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `address` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `ownerid` int DEFAULT NULL,
  `create_time` datetime DEFAULT NULL COMMENT 'Create Time',
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`),
  CONSTRAINT `property_ibfk_1` FOREIGN KEY (`ownerid`) REFERENCES `owner` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='property_table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `property_tenant`
--

DROP TABLE IF EXISTS `property_tenant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_tenant` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `propertyid` int DEFAULT NULL,
  `tenantid` int DEFAULT NULL,
  `ownerid` int DEFAULT NULL COMMENT 'Owner ID',
  `create_time` datetime DEFAULT NULL COMMENT 'Create Time',
  PRIMARY KEY (`id`),
  UNIQUE KEY `propertyid` (`propertyid`,`ownerid`),
  KEY `tenantid_2` (`tenantid`),
  KEY `property_tenant_ibfk_3` (`ownerid`),
  CONSTRAINT `property_tenant_ibfk_1` FOREIGN KEY (`propertyid`) REFERENCES `property` (`id`),
  CONSTRAINT `property_tenant_ibfk_2` FOREIGN KEY (`tenantid`) REFERENCES `tenant` (`id`),
  CONSTRAINT `property_tenant_ibfk_3` FOREIGN KEY (`ownerid`) REFERENCES `owner` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='property_tenant_table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subscription`
--

DROP TABLE IF EXISTS `subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `ownerid` int DEFAULT NULL COMMENT 'owner identifier',
  `ref` double DEFAULT NULL,
  `sumpayed` double DEFAULT NULL COMMENT 'Total Amount Paid',
  `method` varchar(255) DEFAULT NULL COMMENT 'FLOOZ or TMONEY',
  `payment_state` tinyint(1) DEFAULT '0' COMMENT 'Payment Status (0 = not approved, 1 = approved)',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Date and Time of Creation',
  `is_deleted` tinyint(1) DEFAULT '0' COMMENT 'Delete Status (0 = not deleted, 1 = deleted)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ownerid` (`ownerid`,`ref`,`method`),
  CONSTRAINT `subscription_ibfk_1` FOREIGN KEY (`ownerid`) REFERENCES `owner` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='payment_subscription_table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `support_client`
--

DROP TABLE IF EXISTS `support_client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_client` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `tenantid` int DEFAULT NULL,
  `ownerid` int DEFAULT NULL,
  `message` text,
  `by_tenant` tinyint(1) DEFAULT NULL COMMENT 'send by_tenant (0 = not sender, 1 = sender)',
  `by_owner` tinyint(1) DEFAULT NULL COMMENT 'send by_owner (0 = not sender, 1 = sender)',
  `is_viewed_owner` tinyint(1) DEFAULT '1' COMMENT 'is_viewed Status (0 = not viewed, 1 = viewed)',
  `is_viewed_tenant` tinyint(1) DEFAULT '1' COMMENT 'is_viewed Status (0 = not viewed, 1 = viewed)',
  `date_time` datetime DEFAULT NULL COMMENT 'Date and Time',
  PRIMARY KEY (`id`),
  KEY `tenantid` (`tenantid`),
  KEY `ownerid` (`ownerid`),
  CONSTRAINT `support_client_ibfk_1` FOREIGN KEY (`tenantid`) REFERENCES `tenant` (`id`),
  CONSTRAINT `support_client_ibfk_2` FOREIGN KEY (`ownerid`) REFERENCES `owner` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=465 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='support_client_table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tenant`
--

DROP TABLE IF EXISTS `tenant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenant` (
  `lastname` varchar(255) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `conn_key` varchar(8) DEFAULT NULL COMMENT 'Connection Key',
  `pwd` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL COMMENT 'User name',
  `contactmoov` varchar(25) DEFAULT NULL,
  `contacttg` varchar(25) DEFAULT NULL,
  `ownerid` int DEFAULT NULL,
  `create_time` datetime DEFAULT NULL COMMENT 'Create Time',
  `is_activated` tinyint(1) DEFAULT '0' COMMENT 'Activation Status (0 = not activated, 1 = activated)',
  PRIMARY KEY (`id`),
  KEY `ownerid` (`ownerid`),
  CONSTRAINT `tenant_ibfk_1` FOREIGN KEY (`ownerid`) REFERENCES `owner` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='tenant_table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `owner_id` int NOT NULL COMMENT 'Reference to the owner table',
  `amount` double NOT NULL COMMENT 'Amount deducted from the owner s balance',
  `transaction_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date and time of the transaction',
  `is_dayly_spend` tinyint DEFAULT '0' COMMENT '1 if the transaction is regular as spend of insertion of home. 0 if is monthly spend.',
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `owner` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Records monthly deductions from owners';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'house_hiring'
--
/*!50003 DROP PROCEDURE IF EXISTS `activate_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `activate_tenant`(IN p_conn_key CHAR(8))
BEGIN

    DECLARE existing_count INT;
    DECLARE tenantid INT;
    
    SELECT id INTO tenantid FROM tenant WHERE conn_key <> '--------' AND conn_key = p_conn_key;

    -- Vérifier si la clé d'activation existe
    IF (tenantid) THEN
        
        SELECT COUNT(*) INTO existing_count
        FROM property_tenant pt
        WHERE pt.ownerid = (SELECT ownerid FROM property_tenant pt WHERE pt.tenantid = tenantid);

        SELECT id, firstname, existing_count AS count, create_time, 0 AS issetpwd FROM tenant WHERE conn_key = p_conn_key;

        -- Mettre à jour la ligne correspondante
        UPDATE tenant
        SET conn_key = '--------', -- Remplacer la clé par des tirets
            is_activated = TRUE  -- Marquer le compte comme activé
        WHERE conn_key = p_conn_key;
        
    ELSE
        -- Gérer le cas où la clé n'existe pas (facultatif)
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Clé d''activation non trouvée';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `alltenants` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `alltenants`(IN ownerid INT)
BEGIN
    -- Appeler la procédure pour calculer les mois impayés
    CALL calculate_unpaid_months_for_all_tenants(ownerid);

    -- Récupérer les résultats avec les totaux accessory_fees, sumpayed et amount_due
    SELECT  
        t.lastname,
        t.firstname,
        t.contactmoov,
        t.contacttg,
        -- Récupérer les mois impayés et le nombre de mois impayés
        unpaid_info.unpaid_months,
        unpaid_info.unpaid_months_count,
        -- Sous-requête pour calculer les totaux accessory_fees, sumpayed et amount_due
        (
            SELECT IFNULL(SUM(pr.accessory_fees), 0)
            FROM payment_received pr
            JOIN property_tenant pt ON pr.property_tenantid = pt.id
            WHERE pt.tenantid = t.id
        ) AS total_accessory_fees,
        (
            SELECT IFNULL(SUM(pr.sumpayed), 0)
            FROM payment_received pr
            JOIN property_tenant pt ON pr.property_tenantid = pt.id
            WHERE pt.tenantid = t.id
        ) AS total_sumpayed,
        (
            SELECT IFNULL(SUM(pr.amount_due), 0) + 
            (unpaid_info.unpaid_months_count * 
                (SELECT p.price FROM property p WHERE 
                p.id = (SELECT pt.propertyid FROM property_tenant pt 
                    WHERE pt.tenantid = t.id LIMIT 1)))
            FROM payment_received pr
            JOIN property_tenant pt ON pr.property_tenantid = pt.id
            WHERE pt.tenantid = t.id
        ) AS total_amount_due,
        -- Calcul du montant restant à payer
        (
            SELECT total_amount_due - IFNULL(SUM(pr.sumpayed), 0) 
            FROM payment_received pr
            JOIN property_tenant pt ON pr.property_tenantid = pt.id
            WHERE pt.tenantid = t.id
        ) AS rest_amount_due
    FROM 
        tenant t
    LEFT JOIN ( 
        SELECT 
            tenant_id, 
            GROUP_CONCAT(DISTINCT DATE_FORMAT(unpaid_month, '%Y-%m') ORDER BY unpaid_month DESC) AS unpaid_months,
            COUNT(DISTINCT unpaid_month) AS unpaid_months_count
        FROM 
            temp_unpaid_months
        GROUP BY 
            tenant_id
    ) AS unpaid_info ON unpaid_info.tenant_id = t.id
    WHERE 
        t.ownerid = ownerid
    ORDER BY 
        t.create_time DESC; 

    -- Supprimer la table temporaire
    DROP TEMPORARY TABLE IF EXISTS temp_unpaid_months;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `calculate_unpaid_months_for_all_tenants` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `calculate_unpaid_months_for_all_tenants`(IN ownerid INT)
BEGIN
    DECLARE tenant_id INT;
    DECLARE start_date DATE;
    DECLARE done INT DEFAULT FALSE;

    -- Déclaration du curseur pour itérer sur chaque locataire
    DECLARE tenant_cursor CURSOR FOR 
        SELECT id, create_time FROM tenant WHERE ownerid = ownerid;

    -- Déclaration du handler pour gérer la fin des résultats du curseur
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Ouvrir le curseur  
    OPEN tenant_cursor;

    -- Lire les locataires
    read_loop: LOOP
        FETCH tenant_cursor INTO tenant_id, start_date;

        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Appeler la procédure pour calculer les mois impayés d'un locataire spécifique
        CALL calculate_unpaid_month_for_tenant(tenant_id, start_date);
    END LOOP;

    -- Fermer le curseur
    CLOSE tenant_cursor;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `calculate_unpaid_month_for_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `calculate_unpaid_month_for_tenant`(IN tenant_id INT, IN start_date DATE)
BEGIN
    DECLARE end_date DATE;
    DECLARE current_month DATE;

    -- Définir la date de fin au mois précédent
    SET end_date = LAST_DAY(CURDATE() - INTERVAL 1 MONTH);

    -- Créer la table temporaire si elle n'existe pas déjà
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_unpaid_months (
        tenant_id INT,
        unpaid_month DATE,
        UNIQUE (tenant_id, unpaid_month)
    );

    -- Générer tous les mois entre la date d'inscription et le mois précédent, mais ignorer le mois de création
    SET current_month = DATE_ADD(start_date, INTERVAL 1 MONTH);  -- Commence un mois après la date d'inscription
    WHILE current_month <= end_date DO
        IF NOT EXISTS (
            SELECT 1 
            FROM payment_received pr
            WHERE (SELECT tenantid FROM property_tenant pt WHERE pt.id = pr.property_tenantid) = tenant_id 
            AND pr.payment_state = 1
            AND DATE_FORMAT(monthpayed, '%Y-%m') = DATE_FORMAT(current_month, '%Y-%m')
        ) THEN
            -- Insérer les mois impayés dans la table temporaire
            INSERT INTO temp_unpaid_months (tenant_id, unpaid_month) 
            VALUES (tenant_id, current_month);
        END IF;
        SET current_month = DATE_ADD(current_month, INTERVAL 1 MONTH);
    END WHILE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `delete_property` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_property`(IN p_id INT)
BEGIN

    DECLARE property_tenant_id INT;

    SELECT id INTO property_tenant_id
    FROM property_tenant
    WHERE propertyid = p_id;

    -- Supprimer les enregistrements dans payment_received où le locataire est référencé
    DELETE FROM payment_received
    WHERE property_tenantid = property_tenant_id;

    -- Supprimer les enregistrements dans property_tenant où le locataire est référencé
    DELETE FROM property_tenant
    WHERE tenantid = p_id;

    -- Supprimer le locataire dans tenant
    DELETE FROM property
    WHERE id = p_id;

    -- Retourner une valeur de succès
    SELECT 1 AS result;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `delete_property_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_property_tenant`(IN p_id INT)
BEGIN

    -- Supprimer les enregistrements dans payment_received où le locataire est référencé
    DELETE FROM payment_received
    WHERE property_tenantid = p_id;

    DELETE FROM property_tenant
    WHERE id = p_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `delete_receipt` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_receipt`(
    IN p_id INT,               -- Identifiant de la ligne à supprimer
    IN p_role VARCHAR(10)      -- "tenant" ou "owner"
)
BEGIN
    DECLARE v_payment_state INT;
    
    -- Récupérer le statut du paiement
    SELECT payment_state 
    INTO v_payment_state
    FROM payment_received
    WHERE id = p_id;
    
    -- Si le payment_state est égal à 0, on supprime la ligne
    IF v_payment_state = 0 THEN
        DELETE FROM payment_received
        WHERE id = p_id;
        
    -- Si le payment_state est égal à 1, on met à jour le champ approprié en fonction du rôle
    ELSEIF v_payment_state = 1 THEN
        IF p_role = 'tenant' THEN
            UPDATE payment_received
            SET isviewedbytenant = 0
            WHERE id = p_id;
        ELSEIF p_role = 'owner' THEN
            UPDATE payment_received
            SET isviewedbyowner = 0
            WHERE id = p_id;
        END IF;
    END IF;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `delete_subscription` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_subscription`(
    IN p_id INT
)
BEGIN
    DELETE FROM subscription
    WHERE id = p_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `delete_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_tenant`(
    IN tenant_id INT
)
BEGIN
    -- Déclarer une variable pour vérifier si le locataire existe
    DECLARE tenant_exists INT;
    DECLARE property_tenant_id INT;

    -- Vérifier si le locataire existe
    SELECT COUNT(*) INTO tenant_exists
    FROM tenant
    WHERE id = tenant_id;

    -- Si le locataire existe, supprimer les enregistrements associés
    IF tenant_exists > 0 THEN

        -- Supprimer les enregistrements dans support où le locataire est référencé
        DELETE FROM support_client 
        WHERE tenantid = tenant_id;

        SELECT id INTO property_tenant_id
        FROM property_tenant
        WHERE tenantid = tenant_id;

        -- Supprimer les enregistrements dans payment_received où le locataire est référencé
        DELETE FROM payment_received
        WHERE property_tenantid = property_tenant_id;

        -- Supprimer les enregistrements dans property_tenant où le locataire est référencé
        DELETE FROM property_tenant
        WHERE tenantid = tenant_id;

        -- Supprimer le locataire dans tenant
        DELETE FROM tenant
        WHERE id = tenant_id;

        -- Retourner une valeur de succès
        SELECT 1 AS result;
    ELSE
        -- Si le locataire n'existe pas, retourner une valeur d'échec
        SELECT 0 AS result;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_all_subscriptions` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_all_subscriptions`()
BEGIN
    SELECT 
        s.*,
        o.lastname,
        o.email,
        o.sold
    FROM 
        subscription s
    JOIN 
        owner o ON s.ownerid = o.id AND s.is_deleted = 0
        ORDER BY s.create_time;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_messages_viewed_by_owner` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_messages_viewed_by_owner`(IN p_tenant_id INT)
BEGIN
    SELECT *
    FROM support_client sc
    WHERE sc.tenantid = p_tenant_id AND is_viewed_owner = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_messages_viewed_by_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_messages_viewed_by_tenant`(IN p_tenant_id INT)
BEGIN
    SELECT *
    FROM support_client sc
    WHERE sc.tenantid = p_tenant_id AND is_viewed_tenant = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_old_img_url` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_old_img_url`(IN ownerid INT)
BEGIN
    SELECT img_url FROM owner WHERE id = ownerid;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_subscription_by_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_subscription_by_id`(
    IN p_id INT
)
BEGIN
    SELECT *
    FROM subscription
    WHERE id = p_id AND is_deleted = 0;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_unassigned_properties` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_unassigned_properties`(IN ownerid INT)
BEGIN
    SELECT p.*
    FROM property p
    LEFT JOIN property_tenant pt ON p.id = pt.propertyid
    WHERE p.ownerid = ownerid AND pt.propertyid IS NULL
    ORDER BY p.create_time;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insert_message_owner` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_message_owner`(
    IN p_ownerid INT,
    IN p_tenantid INT,
    IN p_message TEXT
)
BEGIN
    DECLARE new_id INT;
    
    -- Insertion du message dans la base de données
    INSERT INTO support_client (message, tenantid, ownerid, by_owner, by_tenant, date_time)
    VALUES (p_message, p_tenantid, p_ownerid, 1, 0, NOW());
    
    -- Récupération de l'ID du message nouvellement inséré
    SET new_id = LAST_INSERT_ID();
    
    -- Retour des informations du message inséré
    SELECT * FROM support_client WHERE id = new_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insert_message_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_message_tenant`(
    IN pr_ten_id INT,
    IN p_message TEXT
)
BEGIN

    DECLARE tenant_id INT;
    DECLARE owner_id INT;
    DECLARE new_id INT;

    SELECT pt.ownerid, pt.tenantid INTO owner_id, tenant_id
    FROM property_tenant pt WHERE pt.id = pr_ten_id;

    INSERT INTO support_client (message, tenantid, ownerid, by_owner, by_tenant, date_time)
    VALUES (p_message, tenant_id, owner_id, 0, 1, NOW());

    -- Récupération de l'ID du message nouvellement inséré
    SET new_id = LAST_INSERT_ID();
    
    -- Retour des informations du message inséré
    SELECT * FROM support_client WHERE id = new_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insert_owner` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_owner`(
    IN pwd VARCHAR(255),
    IN email VARCHAR(255)
)
BEGIN
    INSERT INTO owner (lastname, firstname, pwd, email, 
        contactmoov, contacttg, create_time, sold)
    VALUES (NULL, NULL, pwd, email, NULL, NULL, NOW(), 10000);

    UPDATE owner
    SET next_billing_date = DATE_ADD(create_time, INTERVAL 1 MONTH)
    WHERE next_billing_date IS NULL;

    SELECT id, sold FROM owner o WHERE o.pwd = pwd AND o.email = email;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insert_payment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_payment`(
    IN property_tenantid INT,
    IN sumpayed DOUBLE,
    IN accessory_fees DOUBLE,
    IN monthpayed DATE,
    IN ref DOUBLE PRECISION,
    IN method VARCHAR(255),
    IN create_time DATETIME
)
BEGIN
    DECLARE new_id INT;
    DECLARE amount_due FLOAT;
    DECLARE var_unpaid_months_count INT;
    DECLARE var_unpaid_months VARCHAR(255);
    DECLARE var_rest_amount_due DOUBLE;
    DECLARE global_rest_amount_due DOUBLE;

    -- Obtenir le montant dû
    SELECT price INTO amount_due 
    FROM property 
    WHERE id = (SELECT pt.propertyid FROM property_tenant pt WHERE pt.id = property_tenantid);

    -- Insérer un nouveau paiement 
    INSERT INTO payment_received (
        property_tenantid, 
        sumpayed,
        accessory_fees,
        amount_due,
        monthpayed, 
        ref,
        method, 
        create_time
    )
    VALUES (property_tenantid, sumpayed, accessory_fees, amount_due, monthpayed, ref, method, create_time);

    -- Récupérer l'ID du paiement inséré
    SET new_id = LAST_INSERT_ID();
    
    -- Calculer les mois impayés pour le locataire spécifique
    CALL calculate_unpaid_month_for_tenant(
        (SELECT tenantid FROM property_tenant WHERE id = property_tenantid), 
        (SELECT t.create_time FROM tenant t WHERE t.id = (SELECT tenantid FROM property_tenant WHERE id = property_tenantid))
    );

    -- Obtenir le nombre de mois impayés
    SELECT COUNT(*) INTO var_unpaid_months_count
    FROM temp_unpaid_months
    WHERE DATE_FORMAT(unpaid_month, '%Y-%m') <> DATE_FORMAT(monthpayed, '%Y-%m') AND
        tenant_id = (SELECT tenantid FROM property_tenant WHERE id = property_tenantid);

    -- Récupérer la liste des mois impayés concaténés
    SELECT GROUP_CONCAT(unpaid_month) INTO var_unpaid_months 
    FROM temp_unpaid_months
    WHERE DATE_FORMAT(unpaid_month, '%Y-%m') <> DATE_FORMAT(monthpayed, '%Y-%m') AND
        tenant_id = (SELECT tenantid FROM property_tenant WHERE id = property_tenantid);

    -- Calculer le reste du montant dû pour ce paiement
    SET var_rest_amount_due = amount_due - sumpayed;

    -- Calculer le reste global dû en additionnant les paiements passés
    SELECT 
        (SELECT IFNULL(SUM(pr.amount_due), 0) 
        +        
         (var_unpaid_months_count * amount_due)
         FROM payment_received pr
         JOIN property_tenant pt ON pr.property_tenantid = pt.id
         WHERE pt.tenantid = (SELECT tenantid FROM property_tenant WHERE id = property_tenantid)) 
        - 
        (SELECT IFNULL(SUM(pr.sumpayed), 0)
         FROM payment_received pr
         JOIN property_tenant pt ON pr.property_tenantid = pt.id
         WHERE pt.tenantid = (SELECT tenantid FROM property_tenant WHERE id = property_tenantid))
    INTO global_rest_amount_due;

    -- Mettre à jour le paiement avec les mois impayés, le reste dû, etc.
    UPDATE payment_received 
    SET 
        unpaid_months_count = var_unpaid_months_count,
        unpaid_months = var_unpaid_months,
        rest_amount_due = global_rest_amount_due
    WHERE id = new_id;

    -- Retourner les détails du paiement nouvellement inséré avec le montant dû global
    SELECT 
        pr.id,
        t.firstname,
        t.lastname,
        pr.*, 
        IF (var_rest_amount_due > 0, var_rest_amount_due, 0) AS month_rest_amount_due
    FROM
        property_tenant pt
        JOIN tenant t ON t.id = pt.tenantid
        JOIN payment_received pr ON pr.property_tenantid = pt.id
        JOIN property p ON p.id = pt.propertyid
    WHERE
        pr.id = new_id;

    -- Supprimer la table temporaire
    DROP TEMPORARY TABLE IF EXISTS temp_unpaid_months;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insert_property` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_property`(
    IN ownerid INT,
    IN address_property VARCHAR(100),
    IN description VARCHAR(255),
    IN price DOUBLE
)
BEGIN
    DECLARE new_id INT;

    -- Insérer une nouvelle propriété
    INSERT INTO property (
        address, 
        description, 
        price, 
        ownerid, 
        create_time
    )
    VALUES (
        address_property, 
        description, 
        price, 
        ownerid, 
        NOW()
    );

    -- Récupération de l'ID de la propriété nouvellement inséré
    SET new_id = LAST_INSERT_ID();
    SELECT id, address, description AS description, price, create_time FROM property WHERE id = new_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insert_subscription` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_subscription`(
    IN p_email VARCHAR(255),
    IN p_ref DOUBLE,
    IN p_sumpayed DOUBLE,
    IN p_method VARCHAR(255)
)
BEGIN
    DECLARE v_ownerid INT;
    DECLARE new_id INT;

    -- Rechercher l'ID du propriétaire en fonction de l'email
    SELECT id INTO v_ownerid
    FROM owner
    WHERE email = p_email;

    -- Insertion dans la table subscription
    INSERT INTO subscription(ownerid, ref, sumpayed, method)
    VALUES (v_ownerid, p_ref, p_sumpayed, p_method);

    SET new_id = LAST_INSERT_ID();

    SELECT s.*, o.email, o.lastname  FROM subscription s 
    JOIN owner o ON o.id = v_ownerid
    WHERE s.id = new_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insert_support` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_support`(
    IN tenantid INT,
    IN ownerid INT,
    IN object VARCHAR(255),
    IN messages TEXT,
    IN date_time DATETIME
)
BEGIN
    -- Insérer un nouveau support client
    INSERT INTO support_client (
        tenantid, 
        object, 
        messages, 
        ownerid,
        date_time
    )
    VALUES (
        tenantid, 
        ownerid,
        object, 
        messages, 
        date_time
    );

    -- Retourner une valeur de succès
    SELECT 0 AS result;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insert_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_tenant`(
    IN propertyid INT,
    IN ownerid INT,
    IN conn_key VARCHAR(8),
    IN lastname VARCHAR(255),
    IN firstname VARCHAR(255), 
    IN contactmoov VARCHAR(25),
    IN contacttg VARCHAR(25)
)
BEGIN
    DECLARE tenantid INT;
    DECLARE existing_count INT;
    DECLARE tenant_count INT;
    DECLARE new_id INT;

    -- Vérifier si le couple (propertyid, ownerid) est déjà présent dans property_tenant
    SELECT COUNT(*) INTO existing_count
    FROM property_tenant pt
    WHERE pt.propertyid = propertyid AND pt.ownerid = ownerid;

    -- Si le couple (propertyid, ownerid) est déjà associé à un locataire, signaler une erreur
    IF existing_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La propriété est déjà occupée par un locataire pour ce propriétaire.';
    ELSE
        -- Insérer un nouveau locataire
        INSERT INTO tenant (lastname, firstname, conn_key, pwd, username, contactmoov, contacttg, ownerid, create_time)
        VALUES (lastname, firstname, conn_key, NULL, NULL, contactmoov, contacttg, ownerid, NOW());

        -- Récupérer l'identifiant du locataire
        SELECT id INTO tenantid
        FROM tenant
        WHERE contactmoov = contactmoov AND contacttg = contacttg
        ORDER BY create_time DESC
        LIMIT 1;

        -- Associer le locataire à la propriété
        INSERT INTO property_tenant (propertyid, tenantid, ownerid, create_time)
        VALUES (propertyid, tenantid, ownerid, NOW());

        SELECT COUNT(*) INTO tenant_count
        FROM property_tenant pt
        WHERE pt.ownerid = ownerid;
        
        -- Récupération de l'ID du message nouvellement inséré
        SET new_id = LAST_INSERT_ID();
        
        SELECT 
            pt.id,
            t.firstname, 
            t.lastname, 
            t.contactmoov, 
            t.contacttg, 
            t.conn_key, 
            t.is_activated, 
            t.create_time, 
            p.address, 
            p.price, 
            p.description
            tenant_count
        FROM 
            property_tenant pt
            JOIN property p ON pt.propertyid = p.id
            JOIN tenant t ON pt.tenantid = t.id
        WHERE 
            pt.id = new_id;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `is_deleted_subscription` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `is_deleted_subscription`(
    IN p_id INT
)
BEGIN
    UPDATE subscription SET is_deleted = 1
    WHERE id = p_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `owner_by_email` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `owner_by_email`(IN email VARCHAR(255))
BEGIN
    SELECT id FROM owner o WHERE o.email = email;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `owner_by_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `owner_by_id`(IN id INT)
BEGIN
    SELECT * FROM owner o WHERE o.id = id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `payment_notvalid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `payment_notvalid`(
    IN ownerid INT
)
BEGIN
    SELECT 
        pr.property_tenantid,
        t.firstname,
        t.lastname,
        o.firstname AS owner_firstname,
        o.lastname AS owner_lastname,
        o.contactmoov AS owner_contactmoov,
        o.contacttg AS owner_contacttg,
        o.email AS owner_email,
        o.img_url AS owner_img_url,
        p.address,
        -- Somme des montants payés
        IFNULL(SUM(pr.sumpayed), 0) AS total_sumpayed, 
        IFNULL(SUM(pr.accessory_fees), 0) AS total_accessory_fees,  -- Somme des frais accessoires
        IFNULL(SUM(pr.amount_due), 0) AS total_amount_due, 
        -- Concaténation des mois payés
        GROUP_CONCAT(DISTINCT DATE_FORMAT(pr.monthpayed, '%Y-%m') ORDER BY pr.monthpayed SEPARATOR ', ') AS paid_months,
        -- Concaténation des IDs de paiement
        GROUP_CONCAT(DISTINCT pr.id ORDER BY pr.id SEPARATOR ', ') AS payment_ids,
        -- Récupération des autres colonnes pertinentes
        MAX(pr.create_time) AS last_create_time,
        pr.method, 
        pr.ref,
        pr.payment_state,
        -- Agrégation des autres colonnes si nécessaire
        MAX(pr.unpaid_months_count) AS unpaid_months_count,
        GROUP_CONCAT(DISTINCT DATE_FORMAT(pr.unpaid_months, '%Y-%m') ORDER BY pr.unpaid_months SEPARATOR ', ') AS unpaid_months,
        MAX(pr.rest_amount_due) AS rest_amount_due,
        (
           IFNULL(SUM(pr.amount_due), 0) - IFNULL(SUM(pr.sumpayed), 0) 
        ) AS month_rest_amount_due,
        MAX(pr.validation_date) AS validation_date        
    FROM
        property_tenant pt
        JOIN tenant t ON t.id = pt.tenantid
        JOIN payment_received pr ON pr.property_tenantid = pt.id
        JOIN property p ON p.id = pt.propertyid
        JOIN owner o ON o.id = ownerid
    WHERE
        p.ownerid = ownerid AND pr.payment_state = 0 AND pr.isviewedbyowner = 1
    GROUP BY 
        pr.property_tenantid, t.firstname, t.lastname, 
        o.firstname, o.lastname, o.contactmoov, o.contacttg, o.email, 
        o.img_url, p.address, 
        pr.method, 
        pr.ref
    ORDER BY 
        last_create_time DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `payment_notvalid_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `payment_notvalid_tenant`(
    IN pr_ten_id INT
)
BEGIN
    -- Sélectionner les paiements non validés pour le propriétaire spécifié
    SELECT 
        pr.id,
        t.firstname,
        t.lastname,
        o.firstname AS owner_firstname,
        o.lastname AS owner_lastname,
        o.contactmoov AS owner_contactmoov,
        o.contacttg AS owner_contacttg,
        o.email AS owner_email,
        o.img_url AS owner_img_url,
        pr.sumpayed,
        pr.monthpayed,
        p.address,
        pr.payment_state,
        pr.validation_date,
        pr.create_time
    FROM
        property_tenant pt
        JOIN tenant t ON t.id = pt.tenantid
        JOIN payment_received pr ON pr.property_tenantid = pt.id
        JOIN property p ON p.id = pt.propertyid
        JOIN owner o ON o.id = pt.ownerid
    WHERE
        pt.id = pr_ten_id AND pr.payment_state = 0 ORDER BY pr.monthpayed;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `payment_valid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `payment_valid`(
    IN ownerid INT
)
BEGIN
    SELECT 
        pr.property_tenantid,
        t.firstname,
        t.lastname,
        o.firstname AS owner_firstname,
        o.lastname AS owner_lastname,
        o.contactmoov AS owner_contactmoov,
        o.contacttg AS owner_contacttg,
        o.email AS owner_email,
        o.img_url AS owner_img_url,
        p.address,
        -- Somme des montants payés
        IFNULL(SUM(pr.sumpayed), 0) AS total_sumpayed, 
        IFNULL(SUM(pr.accessory_fees), 0) AS total_accessory_fees,  -- Somme des frais accessoires
        IFNULL(SUM(pr.amount_due), 0) AS total_amount_due, 
        -- Concaténation des mois payés
        GROUP_CONCAT(DISTINCT DATE_FORMAT(pr.monthpayed, '%Y-%m') ORDER BY pr.monthpayed SEPARATOR ', ') AS paid_months,
        -- Concaténation des IDs de paiement
        GROUP_CONCAT(DISTINCT pr.id ORDER BY pr.id SEPARATOR ', ') AS payment_ids,
        -- Récupération des autres colonnes pertinentes
        MAX(pr.create_time) AS last_create_time,
        pr.method, 
        pr.ref,
        pr.payment_state,
        -- Agrégation des autres colonnes si nécessaire
        MAX(pr.unpaid_months_count) AS unpaid_months_count,
        GROUP_CONCAT(DISTINCT DATE_FORMAT(pr.unpaid_months, '%Y-%m') ORDER BY pr.unpaid_months SEPARATOR ', ') AS unpaid_months,
        MAX(pr.rest_amount_due) AS rest_amount_due,
        (
           IFNULL(SUM(pr.amount_due), 0) - IFNULL(SUM(pr.sumpayed), 0) 
        ) AS month_rest_amount_due,
        MAX(pr.validation_date) AS validation_date        
    FROM
        property_tenant pt
        JOIN tenant t ON t.id = pt.tenantid
        JOIN payment_received pr ON pr.property_tenantid = pt.id
        JOIN property p ON p.id = pt.propertyid
        JOIN owner o ON o.id = ownerid
    WHERE
        p.ownerid = ownerid AND pr.payment_state = 1 AND pr.isviewedbyowner = 1
    GROUP BY 
        pr.property_tenantid, t.firstname, t.lastname, 
        o.firstname, o.lastname, o.contactmoov, o.contacttg, o.email, 
        o.img_url, p.address, 
        pr.method, 
        pr.ref
    ORDER BY 
        last_create_time DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `payment_valid_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `payment_valid_tenant`(
    IN pr_ten_id INT
)
BEGIN
    -- Sélectionner les paiements validés pour le propriétaire spécifié
    SELECT 
        pr.id,
        t.firstname,
        t.lastname,
        o.firstname AS owner_firstname,
        o.lastname AS owner_lastname,
        o.contactmoov AS owner_contactmoov,
        o.contacttg AS owner_contacttg,
        o.email AS owner_email,
        o.img_url AS owner_img_url,
        pr.sumpayed,
        pr.monthpayed,
        p.address,
        pr.payment_state,
        pr.validation_date,
        pr.create_time
    FROM
        property_tenant pt
        JOIN tenant t ON t.id = pt.tenantid
        JOIN payment_received pr ON pr.property_tenantid = pt.id
        JOIN property p ON p.id = pt.propertyid
        JOIN owner o ON o.id = pt.ownerid
    WHERE
        pt.id = pr_ten_id AND pr.payment_state = 1 AND pr.isviewedbytenant = 1 ORDER BY pr.monthpayed DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `property_by_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `property_by_id`(IN id INT)
BEGIN
    SELECT * FROM property WHERE property.id = id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `recent_messages_for_owner` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `recent_messages_for_owner`(
    IN p_ownerid INT
)
BEGIN
    -- Récupérer les messages les plus récents envoyés par chaque locataire à un propriétaire spécifique,
    -- ainsi que les informations supplémentaires sur le locataire.
    
    SELECT
        sc.id,                      -- Identifiant du message
        sc.tenantid,                -- Identifiant du locataire
        sc.ownerid,                 -- Identifiant du propriétaire
        sc.message,                 -- Contenu du message
        sc.date_time,               -- Date et heure du message
        sc.by_tenant,               -- Indicateur si le message est envoyé par un locataire
        sc.by_owner,                -- Indicateur si le message est envoyé par un propriétaire
        t.lastname,                 -- Nom du locataire
        t.firstname,                -- Prénom du locataire
        t.contactmoov,              -- Contact Moov du locataire
        t.contacttg                 -- Contact TG du locataire
    FROM
        support_client sc           -- Table des messages, aliasée comme `sc`
    
    JOIN (
        SELECT
            tenantid,               -- Identifiant du locataire
            MAX(date_time) AS recent_date   -- Date la plus récente pour chaque locataire
        FROM
            support_client
        WHERE
            ownerid = p_ownerid      -- Filtrer les messages pour le propriétaire spécifié
        GROUP BY
            tenantid                 -- Grouper par locataire pour obtenir la date la plus récente
    ) AS recent_messages ON sc.tenantid = recent_messages.tenantid
                           AND sc.date_time = recent_messages.recent_date
                           -- Joindre avec la sous-requête pour obtenir les messages les plus récents
    
    JOIN tenant t ON sc.tenantid = t.id
    -- Joindre la table `tenant` pour obtenir les informations sur le locataire
    
    WHERE
        sc.ownerid = p_ownerid      -- Filtrer les messages pour le propriétaire spécifié
    
    ORDER BY
        sc.date_time DESC          -- Trier par date et heure du message en ordre décroissant
    
    LIMIT 6;                       -- Limiter les résultats à 6 messages
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `recent_tenants` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `recent_tenants`(
    IN p_ownerid INT
)
BEGIN
    -- Sélectionner les locataires récents pour le propriétaire spécifié
    SELECT * 
    FROM tenant
    WHERE ownerid = p_ownerid
    ORDER BY create_time DESC
    LIMIT 8;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `reset_pwd_owner` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `reset_pwd_owner`(
    IN p_email VARCHAR(255),
    IN new_pwd VARCHAR(255)
)
BEGIN
    -- Mettre à jour le propriétaire
    UPDATE owner
    SET 
        pwd = new_pwd
    WHERE email = p_email;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `reset_pwd_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `reset_pwd_tenant`(
    IN code VARCHAR(255),
    IN new_pwd VARCHAR(255)
)
BEGIN

    IF EXISTS (SELECT 1 FROM tenant WHERE conn_key = code) THEN
        UPDATE tenant SET pwd = new_pwd WHERE conn_key = code;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Code incorrect.';
    END IF;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `search_by_address_tenant_properties_by_owner` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `search_by_address_tenant_properties_by_owner`(
    IN ownerid INT,
    IN p_address VARCHAR(255)
)
BEGIN
    -- Sélectionner les locataires et les propriétés associées pour le propriétaire spécifié
    SELECT 
        pt.id,
        t.firstname, 
        t.lastname, 
        t.contactmoov, 
        t.contacttg, 
        t.conn_key, 
        t.is_activated, 
        t.create_time, 
        p.address, 
        p.price, 
        p.description
    FROM 
        property_tenant pt
        JOIN property p ON pt.propertyid = p.id
        JOIN tenant t ON pt.tenantid = t.id
    WHERE 
        p.ownerid = ownerid AND
        address LIKE CONCAT('%', p_address, '%')
        ORDER BY pt.create_time;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `search_payment_notvalid_by_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `search_payment_notvalid_by_tenant`(
    IN ownerid INT,
    IN p_lastname VARCHAR(255),
    IN p_fristname VARCHAR(255)
)
BEGIN
    
    SELECT 
        pr.id,
        t.firstname,
        t.lastname,
        o.firstname AS owner_firstname,
        o.lastname AS owner_lastname,
        o.contactmoov AS owner_contactmoov,
        o.contacttg AS owner_contacttg,
        o.email AS owner_email,
        o.img_url AS owner_img_url,
        p.address,
        pr.*
    FROM
        property_tenant pt
        JOIN tenant t ON t.id = pt.tenantid
        JOIN payment_received pr ON pr.property_tenantid = pt.id
        JOIN property p ON p.id = pt.propertyid
        JOIN owner o ON o.id = ownerid
    WHERE
        p.ownerid = ownerid AND pr.payment_state = 0 AND 
        t.lastname LIKE CONCAT('%', p_lastname, '%') AND
        t.firstname LIKE CONCAT('%', p_firstname, '%')
        ORDER BY pr.create_time DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `search_payment_valid_by_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `search_payment_valid_by_tenant`(
    IN ownerid INT,
    IN p_lastname VARCHAR(255),
    IN p_firstname VARCHAR(255)
)
BEGIN
    
    SELECT 
        pr.id,
        t.firstname,
        t.lastname,
        o.firstname AS owner_firstname,
        o.lastname AS owner_lastname,
        o.contactmoov AS owner_contactmoov,
        o.contacttg AS owner_contacttg,
        o.email AS owner_email,
        o.img_url AS owner_img_url,
        p.address,
        pr.*
    FROM
        property_tenant pt
        JOIN tenant t ON t.id = pt.tenantid
        JOIN payment_received pr ON pr.property_tenantid = pt.id
        JOIN property p ON p.id = pt.propertyid
        JOIN owner o ON o.id = ownerid
    WHERE
        p.ownerid = ownerid AND pr.payment_state = 1 AND pr.isviewedbyowner = 1 AND
        t.lastname LIKE CONCAT('%', p_lastname, '%') AND
        t.firstname LIKE CONCAT('%', p_firstname, '%')
        ORDER BY pr.monthpayed DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `search_property_by_address` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `search_property_by_address`(IN ownerid INT, IN p_address VARCHAR(255))
BEGIN
    -- Sélectionner les propriétés pour le propriétaire spécifié
    SELECT * FROM property p
    WHERE p.ownerid = ownerid AND
    address LIKE CONCAT('%', p_address, '%')
    ORDER BY p.create_time;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `search_tenants` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `search_tenants`(
    IN p_firstname VARCHAR(255), 
    IN p_lastname VARCHAR(255), 
    IN p_ownerid INT
)
BEGIN
    -- Appeler la procédure pour calculer les mois impayés
    CALL calculate_unpaid_months_for_all_tenants(ownerid);

    -- Récupérer les résultats avec les totaux accessory_fees, sumpayed et amount_due
    SELECT  
        t.lastname,
        t.firstname,
        t.contactmoov,
        t.contacttg,
        -- Récupérer les mois impayés et le nombre de mois impayés
        unpaid_info.unpaid_months,
        unpaid_info.unpaid_months_count,
        -- Sous-requête pour calculer les totaux accessory_fees, sumpayed et amount_due
        (
            SELECT IFNULL(SUM(pr.accessory_fees), 0)
            FROM payment_received pr
            JOIN property_tenant pt ON pr.property_tenantid = pt.id
            WHERE pt.tenantid = t.id
        ) AS total_accessory_fees,
        (
            SELECT IFNULL(SUM(pr.sumpayed), 0)
            FROM payment_received pr
            JOIN property_tenant pt ON pr.property_tenantid = pt.id
            WHERE pt.tenantid = t.id
        ) AS total_sumpayed,
        (
            SELECT IFNULL(SUM(pr.amount_due), 0) + 
            (unpaid_info.unpaid_months_count * 
                (SELECT p.price FROM property p WHERE 
                p.id = (SELECT pt.propertyid FROM property_tenant pt 
                    WHERE pt.tenantid = t.id LIMIT 1)))
            FROM payment_received pr
            JOIN property_tenant pt ON pr.property_tenantid = pt.id
            WHERE pt.tenantid = t.id
        ) AS total_amount_due,
        -- Calcul du montant restant à payer
        (
            SELECT total_amount_due - IFNULL(SUM(pr.sumpayed), 0) 
            FROM payment_received pr
            JOIN property_tenant pt ON pr.property_tenantid = pt.id
            WHERE pt.tenantid = t.id
        ) AS rest_amount_due
    FROM 
        tenant t
    LEFT JOIN ( 
        SELECT 
            tenant_id, 
            GROUP_CONCAT(DISTINCT DATE_FORMAT(unpaid_month, '%Y-%m') ORDER BY unpaid_month DESC) AS unpaid_months,
            COUNT(DISTINCT unpaid_month) AS unpaid_months_count
        FROM 
            temp_unpaid_months
        GROUP BY 
            tenant_id
    ) AS unpaid_info ON unpaid_info.tenant_id = t.id
    WHERE 
        t.ownerid = ownerid
        AND (t.firstname LIKE CONCAT('%', p_firstname, '%') OR p_firstname IS NULL)
        AND (t.lastname LIKE CONCAT('%', p_lastname, '%') OR p_lastname IS NULL)
    ORDER BY 
        t.create_time DESC; 

    -- Supprimer la table temporaire
    DROP TEMPORARY TABLE IF EXISTS temp_unpaid_months;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `set_img_url` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `set_img_url`(IN ownerid INT, p_img_url VARCHAR(255))
BEGIN
    UPDATE owner SET img_url = p_img_url WHERE id = ownerid;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `set_tenant_pwd` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `set_tenant_pwd`(IN tenantid int, IN tenantpwd VARCHAR(255), IN p_username VARCHAR(255))
BEGIN
    UPDATE tenant SET pwd = tenantpwd, username = p_username WHERE id = tenantid;

    -- Retourner une valeur de succès
    SELECT 0 AS result;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `show_admin` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `show_admin`(IN email VARCHAR(255))
BEGIN
    -- Sélectionner les détails du propriétaire avec l'email spécifié
    SELECT * FROM admin WHERE admin.email = email LIMIT 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `show_owner` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `show_owner`(IN email VARCHAR(255))
BEGIN
    -- Sélectionner les détails du propriétaire avec l'email spécifié
    SELECT * FROM owner WHERE owner.email = email LIMIT 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `show_properties` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `show_properties`(IN ownerid INT)
BEGIN
    -- Sélectionner les propriétés pour le propriétaire spécifié
    SELECT * FROM property p
    WHERE p.ownerid = ownerid ORDER BY p.create_time;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `show_tenants` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `show_tenants`(IN ownerid INT)
BEGIN
    -- Sélectionner les locataires et les informations de propriété pour le propriétaire spécifié
    SELECT 
        pt.id AS id,
        t.firstname AS firstname,
        t.lastname AS lastname,
        t.contactmoov AS contactmoov,
        t.contacttg AS contacttg,
        p.address,
        p.price
    FROM 
        property_tenant pt
        JOIN property p ON p.id = pt.propertyid
        JOIN tenant t ON t.id = pt.tenantid
    WHERE 
        p.ownerid = ownerid ORDER BY t.create_time DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `show_tenant_by_username` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `show_tenant_by_username`(IN p_username VARCHAR(255))
BEGIN

    SELECT t.id, t.pwd, pt.id pr_ten_id FROM tenant t 
    JOIN property_tenant pt ON pt.tenantid = t.id
    WHERE t.username = p_username;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tenant_by_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tenant_by_id`(IN id INT)
BEGIN
    SELECT * FROM tenant WHERE tenant.id = id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tenant_properties_by_owner` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tenant_properties_by_owner`(
    IN ownerid INT
)
BEGIN
    -- Sélectionner les locataires et les propriétés associées pour le propriétaire spécifié
    SELECT 
        pt.id,
        t.firstname, 
        t.lastname, 
        t.contactmoov, 
        t.contacttg, 
        t.conn_key, 
        t.is_activated, 
        t.create_time, 
        p.address, 
        p.price, 
        p.description
    FROM 
        property_tenant pt
        JOIN property p ON pt.propertyid = p.id
        JOIN tenant t ON pt.tenantid = t.id
    WHERE 
        p.ownerid = ownerid ORDER BY pt.create_time;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tenant_property_by_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tenant_property_by_tenant`(
    IN pr_ten_id INT
)
BEGIN
    -- Sélectionner les locataires et les propriétés associées pour le propriétaire spécifié
    SELECT 
        pt.id,
        t.firstname, 
        t.lastname, 
        t.contactmoov, 
        t.contacttg, 
        t.conn_key, 
        t.is_activated, 
        t.create_time, 
        p.address, 
        p.price, 
        p.description
    FROM 
        property_tenant pt
        JOIN property p ON pt.propertyid = p.id
        JOIN tenant t ON pt.tenantid = t.id
    WHERE 
        pt.id = pr_ten_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_message_viewed_owner` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_message_viewed_owner`(IN p_message_id INT)
BEGIN
    DECLARE v_is_viewed_tenant TINYINT;

    -- Sélectionner les valeurs actuelles de `is_viewed_owner` et `is_viewed_tenant`
    SELECT is_viewed_tenant
    INTO v_is_viewed_tenant
    FROM support_client
    WHERE id = p_message_id;

    -- Vérifier les conditions pour mettre à jour ou supprimer
    IF v_is_viewed_tenant = 1 THEN
        -- Mettre à jour `is_viewed_owner` à 0
        UPDATE support_client
        SET is_viewed_owner = 0
        WHERE id = p_message_id;
    ELSEIF v_is_viewed_tenant = 0 THEN
        -- Supprimer le message
        DELETE FROM support_client
        WHERE id = p_message_id;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_message_viewed_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_message_viewed_tenant`(IN p_message_id INT)
BEGIN
    DECLARE v_is_viewed_owner TINYINT;

    -- Sélectionner les valeurs actuelles de `is_viewed_owner` et `is_viewed_tenant`
    SELECT is_viewed_owner
    INTO v_is_viewed_owner
    FROM support_client
    WHERE id = p_message_id;

    -- Vérifier les conditions pour mettre à jour ou supprimer
    IF v_is_viewed_owner = 1 THEN
        -- Mettre à jour `is_viewed_owner` à 0
        UPDATE support_client
        SET is_viewed_tenant = 0
        WHERE id = p_message_id;
    ELSEIF v_is_viewed_owner = 0 THEN
        -- Supprimer le message
        DELETE FROM support_client
        WHERE id = p_message_id;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_owner` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_owner`(
    IN ownerid INT,
    IN new_lastname VARCHAR(255),
    IN new_firstname VARCHAR(255),
    IN new_email VARCHAR(255),
    IN new_contactmoov VARCHAR(25),
    IN new_contacttg VARCHAR(25)
)
BEGIN
    -- Mettre à jour le propriétaire
    UPDATE owner
    SET 
        firstname = new_firstname,
        lastname = new_lastname,
        email = new_email,
        contactmoov = new_contactmoov,
        contacttg = new_contacttg
    WHERE id = ownerid;

    -- Renvoyer le propriétaire mis à jour
    SELECT * FROM owner WHERE id = ownerid;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_owner_sold` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_owner_sold`(
    IN p_ownerid INT,
    IN p_ref DOUBLE,
    IN p_method VARCHAR(255)
)
BEGIN
    DECLARE v_sumpayed DOUBLE;

    -- Calculer le total des sommes payées pour le propriétaire
    SELECT sumpayed INTO v_sumpayed
    FROM subscription
    WHERE ref = p_ref AND ownerid = p_ownerid AND method = p_method;

    -- Mettre à jour le sold du propriétaire
    UPDATE owner
    SET sold = sold + v_sumpayed
    WHERE id = p_ownerid;

    UPDATE subscription SET payment_state = 1
    WHERE ref = p_ref AND ownerid = p_ownerid;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_property` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_property`(
    IN property_id INT,
    IN new_address VARCHAR(100),
    IN new_description VARCHAR(255),
    IN new_price DOUBLE
)
BEGIN
    -- Déclarer une variable pour vérifier si la propriété existe
    DECLARE property_exists INT;

    -- Vérifier si la propriété existe
    SELECT COUNT(*) INTO property_exists
    FROM property p
    WHERE p.id = property_id;

    -- Si la propriété existe, mettre à jour les attributs
    IF property_exists > 0 THEN
        -- Mettre à jour les attributs de la propriété
        UPDATE property p
        SET p.address = new_address,
            p.description = new_description,
            p.price = new_price
        WHERE p.id = property_id;

        -- Renvoyer la propriété modifiée
        SELECT p.id, p.address, p.description AS description, p.price, p.ownerid, p.create_time
        FROM property p
        WHERE p.id = property_id;
    ELSE
        -- Si la propriété n'existe pas, retourner une valeur d'échec
        SELECT 'Property not found' AS result;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_sold` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_sold`(
    IN ownerid INT,
    IN spend DOUBLE
)
BEGIN
    DECLARE new_sold DOUBLE;
    
    -- Mise à jour du solde
    UPDATE owner
    SET sold = sold - spend
    WHERE id = ownerid;
    
    -- Récupération de la nouvelle valeur du solde
    SELECT sold INTO new_sold
    FROM owner
    WHERE id = ownerid;

    IF (spend > 0 ) THEN
        INSERT INTO transactions (owner_id, amount, is_dayly_spend) VALUES (ownerid, spend, 1);
    END IF;  
    
    -- Retourner la nouvelle valeur de sold
    SELECT new_sold AS update_sold;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_tenant` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_tenant`(
    IN tenantid INT,
    IN new_lastname VARCHAR(255),
    IN new_firstname VARCHAR(255),
    IN new_contactmoov VARCHAR(25),
    IN new_contacttg VARCHAR(25),
    IN new_create_time DATETIME
)
BEGIN
    -- Mettre à jour le locataire
    UPDATE tenant
    SET 
        lastname = new_lastname,
        firstname = new_firstname,
        contactmoov = new_contactmoov,
        contacttg = new_contacttg,
        create_time = new_create_time
    WHERE id = tenantid;

    -- Renvoyer le locataire mis à jour
    SELECT * FROM tenant WHERE id = tenantid;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_tenant_key` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_tenant_key`(
    IN tenantid INT,
    IN new_keyword VARCHAR(255)
)
BEGIN
    -- Mettre à jour le locataire
    UPDATE tenant
    SET 
        conn_key = new_keyword
    WHERE id = tenantid;

    -- Renvoyer le locataire mis à jour
    SELECT * FROM tenant WHERE id = tenantid;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `validate_payment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `validate_payment`(
    IN id INT
)
BEGIN
    -- Mise à jour de l'état du paiement
    UPDATE payment_received
    SET payment_state = 1, validation_date = NOW()
    WHERE payment_received.id = id;
    
    -- Retourner un code de succès
    SELECT 0 AS result;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-27  3:11:59
