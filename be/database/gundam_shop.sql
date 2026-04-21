-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: gundam-db-server.mysql.database.azure.com    Database: gundam_store
-- ------------------------------------------------------
-- Server version	8.0.44-azure

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `my_row_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `added_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`my_row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Gundam'),(2,'Figure Anime'),(5,'Kamen Rider');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follows`
--

DROP TABLE IF EXISTS `follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follows` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `follower_id` int NOT NULL,
  `following_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follows`
--

LOCK TABLES `follows` WRITE;
/*!40000 ALTER TABLE `follows` DISABLE KEYS */;
INSERT INTO `follows` VALUES (1,21,19,'2026-03-16 09:22:53');
/*!40000 ALTER TABLE `follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2019_12_14_000001_create_personal_access_tokens_table',1),(2,'2026_03_14_101900_fix_azure_invisible_primary_keys',2),(3,'2026_03_16_100000_fix_invisible_primary_keys_project_tables',3);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `my_row_id` bigint unsigned NOT NULL AUTO_INCREMENT ,
  `id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`my_row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `my_row_id` bigint unsigned NOT NULL AUTO_INCREMENT ,
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `total_price` decimal(12,2) DEFAULT NULL,
  `status` enum('pending','paid','shipping','completed','cancelled') DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `receiver_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`my_row_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',7,'api-token','db08f9d2fbf10f31bfc694a4e17a0a6e347bd1d496612ab17ed7015b2f8ea40f','[\"*\"]',NULL,NULL,'2026-03-07 14:58:55','2026-03-07 14:58:55'),(2,'App\\Models\\User',8,'api-token','25edc4e64c2438e8e2ffdba2a81befb1674100179cfb504dbebb0f30a23d8b86','[\"*\"]',NULL,NULL,'2026-03-07 15:02:26','2026-03-07 15:02:26'),(3,'App\\Models\\User',9,'api-token','9c3b8021959a7ed00a0266f85bf94c03be10ef0747621a5b8b392ffd523a6441','[\"*\"]',NULL,NULL,'2026-03-07 15:03:36','2026-03-07 15:03:36'),(4,'App\\Models\\User',15,'auth_token','277f6cf012b666a7c6754df68abf59126e560e83a8b565c298f351b9f6cecaa0','[\"*\"]',NULL,NULL,'2026-03-14 10:18:17','2026-03-14 10:18:17'),(5,'App\\Models\\User',16,'auth_token','f3d589b91735f02c154e724174de92cf54076766b1157d5ea567f22c102a6452','[\"*\"]',NULL,NULL,'2026-03-14 10:20:27','2026-03-14 10:20:27'),(6,'App\\Models\\User',17,'auth_token','afe164e5be7d8edb6a1ca816742982e98e68df12168aa6c0d86552c40ceb8936','[\"*\"]',NULL,NULL,'2026-03-14 10:20:57','2026-03-14 10:20:57'),(7,'App\\Models\\User',18,'auth_token','a821de2e1ef7a91e4d6f934bc38a5edb450257917a4fd68a7669130c151506b7','[\"*\"]',NULL,NULL,'2026-03-14 10:29:17','2026-03-14 10:29:17'),(8,'App\\Models\\User',20,'auth_token','8ee72aad24a9d0c80f5107a97619b63f9d790b25f87363aec70d4ac197b8e6bd','[\"*\"]',NULL,NULL,'2026-03-16 08:00:37','2026-03-16 08:00:37'),(9,'App\\Models\\User',21,'auth_token','13be2d757aa35b8f603828410a757c7b2a2f28a3e718d1a096146e4e507f992c','[\"*\"]',NULL,NULL,'2026-03-16 08:02:04','2026-03-16 08:02:04'),(10,'App\\Models\\User',21,'auth_token','51a9954a14327c7d11567109371e6dda382e47f660604588ee8fca88a17e62cf','[\"*\"]',NULL,NULL,'2026-03-16 08:02:54','2026-03-16 08:02:54'),(11,'App\\Models\\User',21,'auth_token','7eed3ad4365062d82d462ffc1e7c499c627caf6afdfa759bc1b3d656c8c47583','[\"*\"]',NULL,NULL,'2026-03-16 08:03:07','2026-03-16 08:03:07'),(12,'App\\Models\\User',21,'auth_token','0a6552cc7d9d4aaf8896c8d802d647dfb9003a589e0f8afaeab839b229efa90b','[\"*\"]','2026-03-16 15:44:07',NULL,'2026-03-16 08:50:37','2026-03-16 15:44:07'),(13,'App\\Models\\User',20,'auth_token','5f0c58b6535613d555ef361c5cdcf9be73747f56c95048615f6e9ca4d76ff62e','[\"*\"]','2026-04-02 08:43:43',NULL,'2026-03-17 07:09:43','2026-04-02 08:43:43'),(14,'App\\Models\\User',4,'auth_token','19258120503613c6a5d6293f7c6084223adf1892a031f53c9a6dba9b8ed23c7e','[\"*\"]',NULL,NULL,'2026-03-18 08:02:44','2026-03-18 08:02:44'),(15,'App\\Models\\User',4,'auth_token','f3be8c945bc35e407e82a45fb4ce1f8635ecb6817f3c8199b67f585e0ac769d2','[\"*\"]',NULL,NULL,'2026-03-18 08:02:47','2026-03-18 08:02:47'),(16,'App\\Models\\User',4,'auth_token','b4cd41bd26a5a5ea5e708c66bd555237fe591e577bf64eb728aa5c3c5055694c','[\"*\"]',NULL,NULL,'2026-03-18 08:02:49','2026-03-18 08:02:49'),(17,'App\\Models\\User',21,'auth_token','e72af0ef06702abf68ca3d98b2f82d567141c68ef2a8638c5b708d7b00689009','[\"*\"]',NULL,NULL,'2026-03-18 08:24:43','2026-03-18 08:24:43'),(18,'App\\Models\\User',21,'auth_token','002f778a05fd96e309698471be8ae3e860feee6638f2eeb92691f5c2a8dc394c','[\"*\"]',NULL,NULL,'2026-03-18 08:27:32','2026-03-18 08:27:32'),(19,'App\\Models\\User',21,'auth_token','806561e62a22db31aa6a3d84f08864aa2248f809f916dbe59b12f0b6210befa1','[\"*\"]',NULL,NULL,'2026-03-18 08:31:50','2026-03-18 08:31:50'),(20,'App\\Models\\User',21,'auth_token','0c38b0ebf936f28db45d2a0f4e4ec2f5e067fef1b1923e588665bc356c02ba3e','[\"*\"]',NULL,NULL,'2026-03-18 08:51:11','2026-03-18 08:51:11'),(21,'App\\Models\\User',21,'auth_token','257b534702e1c967f87d6b0eafbeaf70c8d2d44e69ad64c441de20fcea2f1172','[\"*\"]',NULL,NULL,'2026-03-18 08:55:19','2026-03-18 08:55:19'),(22,'App\\Models\\User',23,'auth_token','6f9543915ed5a513cec24e2ac5abc7020b31da5fd52698c50c1de6d0bfcd25c7','[\"*\"]',NULL,NULL,'2026-03-18 09:14:15','2026-03-18 09:14:15'),(23,'App\\Models\\User',21,'auth_token','adf5939118695845a87b616b3a82121594677e727ad2e7baae412914142f45b5','[\"*\"]',NULL,NULL,'2026-03-22 01:34:27','2026-03-22 01:34:27'),(24,'App\\Models\\User',23,'auth_token','6bfc5e1d141633a4020ad96b9febd800e0aa12961eea84006e0605abef118586','[\"*\"]',NULL,NULL,'2026-03-22 02:14:53','2026-03-22 02:14:53'),(25,'App\\Models\\User',23,'auth_token','a118bd98ab86fa96e1a40449cc35031b63f71b2ffc64526d05c9d6164355d265','[\"*\"]','2026-03-22 02:55:50',NULL,'2026-03-22 02:53:51','2026-03-22 02:55:50'),(26,'App\\Models\\User',23,'auth_token','dc34a36348c361cced678734c46970254a55c6b21d5f93260772c24affba37d1','[\"*\"]','2026-03-22 02:56:33',NULL,'2026-03-22 02:56:03','2026-03-22 02:56:33'),(27,'App\\Models\\User',23,'auth_token','f97df665e15dece80f1de2df6e6640acbe802b82af0892782d70e7d80e318d5e','[\"*\"]','2026-03-22 02:58:46',NULL,'2026-03-22 02:56:54','2026-03-22 02:58:46'),(28,'App\\Models\\User',23,'auth_token','da20590ffeff9ded9c27875a346cdb6a67c084287d2df33e78bdc18285f2dae2','[\"*\"]','2026-03-22 03:01:43',NULL,'2026-03-22 02:59:12','2026-03-22 03:01:43'),(29,'App\\Models\\User',23,'auth_token','5533a046b9ac1520ba61c13984abc7a5857521bd0828178613d7f8b4a11046c5','[\"*\"]','2026-03-22 03:28:54',NULL,'2026-03-22 03:02:04','2026-03-22 03:28:54'),(30,'App\\Models\\User',23,'auth_token','f7d7e77d32ef21c18526defa9e77771cc08856b9ed32900a829f918a5cff719f','[\"*\"]','2026-03-24 05:58:33',NULL,'2026-03-24 04:53:47','2026-03-24 05:58:33'),(31,'App\\Models\\User',23,'auth_token','2770443041a2ddcd5c2364c1e3682b905a104bc68288e80aa0c34510bfb2b725','[\"*\"]','2026-03-24 06:03:22',NULL,'2026-03-24 05:59:00','2026-03-24 06:03:22'),(32,'App\\Models\\User',23,'auth_token','fef622fac4a299a3f37e3b7b8583335aa6c4549ef382e9146f9a3e31f7781185','[\"*\"]',NULL,NULL,'2026-03-24 08:03:51','2026-03-24 08:03:51'),(33,'App\\Models\\User',21,'auth_token','6b5a203ac75c2eacaa81a2d16c5538d4d606eabf4c625f26e10375872403f6e3','[\"*\"]',NULL,NULL,'2026-03-24 08:04:14','2026-03-24 08:04:14'),(34,'App\\Models\\User',21,'auth_token','bdac4a81b871f3ff9c23407aff4d2de8135ab245b251e9435db399758cb7ac89','[\"*\"]',NULL,NULL,'2026-03-24 08:10:18','2026-03-24 08:10:18'),(35,'App\\Models\\User',23,'auth_token','5c08a67f66ee538f1cd651e9ed6a6c0fcbe86cf8abd3a73e0e873d2975c41fab','[\"*\"]','2026-03-24 08:13:36',NULL,'2026-03-24 08:13:27','2026-03-24 08:13:36'),(36,'App\\Models\\User',23,'auth_token','3a68d2a0678226aef4b1855cdc301c8a5c108b621a3de31d7813f43b9b0ff296','[\"*\"]','2026-03-24 10:39:45',NULL,'2026-03-24 08:13:30','2026-03-24 10:39:45'),(37,'App\\Models\\User',21,'auth_token','e8c7b93902995db0952587d7ced21e2f4972efd88576fe5045bb1c53aaceb7c2','[\"*\"]',NULL,NULL,'2026-03-24 08:20:29','2026-03-24 08:20:29'),(38,'App\\Models\\User',21,'auth_token','8119d79a2d4260aa69eaa616457c37361dcd88241ff79e50aeb0b4ce05d0672c','[\"*\"]',NULL,NULL,'2026-03-24 08:20:35','2026-03-24 08:20:35'),(39,'App\\Models\\User',21,'auth_token','cab48060baecb4a7cf5329984ef5de76ec34554662ff21d30e33cfb5d0fc86c0','[\"*\"]',NULL,NULL,'2026-03-24 08:20:39','2026-03-24 08:20:39'),(40,'App\\Models\\User',21,'auth_token','a1af8d8aad9170434cf4e371ded1bee82ef0f748fdf008f5491ee76576046e58','[\"*\"]',NULL,NULL,'2026-03-24 08:20:42','2026-03-24 08:20:42'),(41,'App\\Models\\User',21,'auth_token','27b0f8744ac8e7a37a1346b64ab9342da93de26031cdbd60b29270d3b046ffaa','[\"*\"]',NULL,NULL,'2026-03-24 08:21:02','2026-03-24 08:21:02'),(42,'App\\Models\\User',23,'auth_token','ae081a7a123e7e4bdbb377abf6f77f2947e14696f83c027102c4ca2b9669e8ca','[\"*\"]',NULL,NULL,'2026-03-24 08:25:08','2026-03-24 08:25:08'),(43,'App\\Models\\User',21,'auth_token','cdfdb8689fb645863920b82a04253e9dec76eba6fb770afe6e7cac5ab26c346f','[\"*\"]',NULL,NULL,'2026-03-24 08:25:52','2026-03-24 08:25:52'),(44,'App\\Models\\User',21,'auth_token','1bd301edd9d30f5681eb5eed222693e45624b5617f9d21c14ea72883c2d51c73','[\"*\"]',NULL,NULL,'2026-03-24 08:26:18','2026-03-24 08:26:18'),(45,'App\\Models\\User',21,'auth_token','6fd42af94dfb077c5ec8a3374861fa59ae100b86effd6512d0d129312e94a566','[\"*\"]',NULL,NULL,'2026-03-24 08:26:21','2026-03-24 08:26:21'),(46,'App\\Models\\User',21,'auth_token','7b1717a44415c15c59e1e9f6cf383d274516ae9074573d3a291c8d023ec1d227','[\"*\"]',NULL,NULL,'2026-03-24 08:28:37','2026-03-24 08:28:37'),(47,'App\\Models\\User',21,'auth_token','97e9ca24d166965884f618228c6892568ffa2c504ff4dd0d1b3eb621edbe2094','[\"*\"]',NULL,NULL,'2026-03-24 08:29:59','2026-03-24 08:29:59'),(48,'App\\Models\\User',23,'auth_token','8771114e97dd8f0b149047bcadab381ca8bfeda91e7819da8b2da8618c7ce7c0','[\"*\"]',NULL,NULL,'2026-03-24 08:32:38','2026-03-24 08:32:38'),(49,'App\\Models\\User',21,'auth_token','ffafc947f70ad1f7e97a9c36419625279fd8839c4e42046457249d555fd9b5f8','[\"*\"]',NULL,NULL,'2026-03-24 08:33:08','2026-03-24 08:33:08'),(50,'App\\Models\\User',23,'auth_token','cda0e88850053c9865f9b6c0c08741089f001ef7d0c11aad8a0e8fd5544d1941','[\"*\"]','2026-03-24 10:40:12',NULL,'2026-03-24 10:39:57','2026-03-24 10:40:12'),(51,'App\\Models\\User',23,'auth_token','dec3e5fe3f911e802bbf04468cb1562057a8f45b2cc73b6acfdda6aca2e0e51f','[\"*\"]','2026-03-24 12:13:47',NULL,'2026-03-24 12:11:26','2026-03-24 12:13:47'),(52,'App\\Models\\User',23,'auth_token','9b7a483c4c45a5b1a8da28f1c27bea5871f284ce11b74bf68e3d2a3add0e4d8e','[\"*\"]','2026-03-27 11:20:14',NULL,'2026-03-27 11:20:07','2026-03-27 11:20:14'),(53,'App\\Models\\User',21,'auth_token','0188b1ac39c99521d80159a7501df7042122f8adf237013e7f2f3301965b5310','[\"*\"]',NULL,NULL,'2026-03-27 11:20:56','2026-03-27 11:20:56'),(54,'App\\Models\\User',23,'auth_token','d39dc302b3e7cb11ae0128998eeee7de92c0ef69584f6725d1b2fbf289120afc','[\"*\"]','2026-03-27 11:22:01',NULL,'2026-03-27 11:21:52','2026-03-27 11:22:01'),(55,'App\\Models\\User',23,'auth_token','faac5d48be464e25ce9786dd1cc03df1e14e4a595a0f39df49f2051473e08e7e','[\"*\"]','2026-03-27 12:57:51',NULL,'2026-03-27 11:21:56','2026-03-27 12:57:51'),(56,'App\\Models\\User',23,'auth_token','79bbacc83ca33800c13b389e1960a6a4ed0dee9f327ecd4acbb5d08989379130','[\"*\"]','2026-03-27 13:43:20',NULL,'2026-03-27 12:57:55','2026-03-27 13:43:20'),(57,'App\\Models\\User',23,'auth_token','3d95c615e3ea684b92cf3ba34770a95097aeaad8b26430fbc01796e8d0a9b5ea','[\"*\"]','2026-03-29 01:42:20',NULL,'2026-03-27 13:43:23','2026-03-29 01:42:20'),(58,'App\\Models\\User',23,'auth_token','5634073cd4bd1f61c2a04c1c6ddd4bb3656b8c9fea72339c6ed5e7bd7481fab8','[\"*\"]','2026-03-29 12:30:21',NULL,'2026-03-29 01:42:24','2026-03-29 12:30:21'),(59,'App\\Models\\User',23,'auth_token','8a198bb8a8e364bcc5d5fcd9c6d8ce34578ea3be160f9d0fc6b63d189756a1e4','[\"*\"]','2026-03-31 13:22:27',NULL,'2026-03-29 12:30:33','2026-03-31 13:22:27'),(60,'App\\Models\\User',21,'auth_token','d3382ec28daba8b31c336d81605782b0bcbd21c108d13d48905586a054e513e8','[\"*\"]',NULL,NULL,'2026-03-31 12:54:52','2026-03-31 12:54:52'),(61,'App\\Models\\User',21,'auth_token','4aead9c6f7c31adcf677fdc22cc1078732903c86292f857e59469e861f8511fe','[\"*\"]',NULL,NULL,'2026-03-31 12:55:18','2026-03-31 12:55:18'),(62,'App\\Models\\User',23,'auth_token','242c0088b36445d93a89086948e4c5fe98bb46c446c0507197370b213c902639','[\"*\"]',NULL,NULL,'2026-03-31 12:57:00','2026-03-31 12:57:00'),(63,'App\\Models\\User',24,'auth_token','abd97c34d0540f5c0023d440ab3c09e31df0697fc13c65314ddd463fd6930205','[\"*\"]',NULL,NULL,'2026-03-31 12:59:20','2026-03-31 12:59:20'),(64,'App\\Models\\User',24,'auth_token','52aba401ebc3c9f55dcf2da7986336033644ca8d29b0e24f473d289f0928455a','[\"*\"]',NULL,NULL,'2026-03-31 12:59:52','2026-03-31 12:59:52'),(65,'App\\Models\\User',24,'auth_token','5dc41cac89c35d86b00dfbf42dd58051989e41c65f7b1e19d1fa493ef9cc9a26','[\"*\"]',NULL,NULL,'2026-03-31 13:01:15','2026-03-31 13:01:15'),(66,'App\\Models\\User',23,'auth_token','220b14d87b0bedc28d5817074c3e5f6b02763605da5bf95901da7d3ab55421eb','[\"*\"]',NULL,NULL,'2026-03-31 13:02:33','2026-03-31 13:02:33'),(67,'App\\Models\\User',23,'auth_token','ea5903d71c8bf85134610d00ef19895c4f243c60cb21d3d31d17daef813a9396','[\"*\"]',NULL,NULL,'2026-03-31 13:03:11','2026-03-31 13:03:11'),(68,'App\\Models\\User',23,'auth_token','7cd679e7fe63dd6b85c2beaa6a9530cae69c0c5ad20e53f57b0fae594dfb19d7','[\"*\"]',NULL,NULL,'2026-03-31 13:08:12','2026-03-31 13:08:12'),(69,'App\\Models\\User',21,'auth_token','934790cbe451b28832681460df49de458a1f4e6fb936ce3f91390c097343fd45','[\"*\"]',NULL,NULL,'2026-03-31 13:15:43','2026-03-31 13:15:43'),(70,'App\\Models\\User',21,'auth_token','6637b100ed896462c792a92d1dd953e43e4286e024e390fc093333c5970cae7d','[\"*\"]','2026-03-31 13:23:28',NULL,'2026-03-31 13:22:42','2026-03-31 13:23:28'),(71,'App\\Models\\User',23,'auth_token','020a52cd5f18fa561d1ed7d2e6063cdd8713482a5a677c0144d8c7b3d19cee19','[\"*\"]','2026-03-31 13:24:13',NULL,'2026-03-31 13:23:46','2026-03-31 13:24:13'),(72,'App\\Models\\User',21,'auth_token','905c7330c1dea9d42898333b3e3bd5f9e25f754470be7b2659206ce3752438b4','[\"*\"]',NULL,NULL,'2026-03-31 13:25:52','2026-03-31 13:25:52'),(73,'App\\Models\\User',21,'auth_token','31b6f3cffbfc551de28c2d1feb946ae76db83ceb515e2cdc71a3fa00d2c102bf','[\"*\"]',NULL,NULL,'2026-03-31 13:26:21','2026-03-31 13:26:21'),(74,'App\\Models\\User',21,'auth_token','60cf2daddf077834145fba22d1da8eb5cfcb310fa1c6e5285a051bdd2ec5b213','[\"*\"]',NULL,NULL,'2026-03-31 13:44:39','2026-03-31 13:44:39'),(75,'App\\Models\\User',21,'auth_token','5f6f21201616a0c01481f6730069d5cb64e8bf5bad04f1c2442f7922d50fee93','[\"*\"]',NULL,NULL,'2026-03-31 13:44:43','2026-03-31 13:44:43'),(76,'App\\Models\\User',21,'auth_token','278a49b761052b09b27fb8cfaa3daeb7eb624d3b3124d92f03da76b4a9f1c42c','[\"*\"]',NULL,NULL,'2026-03-31 13:44:46','2026-03-31 13:44:46'),(77,'App\\Models\\User',21,'auth_token','62b7cb1b390dd7f07fd67e7aabca2f360d179b777cf8ca353376c656b6d4e9e4','[\"*\"]',NULL,NULL,'2026-03-31 13:44:50','2026-03-31 13:44:50'),(78,'App\\Models\\User',21,'auth_token','9e129af6792f6fd42a3b9cbdcf9901c4d4d0cfb367d9d0ba7fa1c7b47a7104b3','[\"*\"]',NULL,NULL,'2026-03-31 13:44:53','2026-03-31 13:44:53'),(79,'App\\Models\\User',21,'auth_token','32239c7b6f8649636eb5bfe9ca1e25407f17c43ecdeb3991c8196d5707fe34e8','[\"*\"]',NULL,NULL,'2026-03-31 13:44:56','2026-03-31 13:44:56'),(80,'App\\Models\\User',21,'auth_token','97a5238f861eccabe59c1436ae4b840b509f87d5bae0c950c8910fdc9552dc18','[\"*\"]',NULL,NULL,'2026-03-31 13:45:00','2026-03-31 13:45:00'),(81,'App\\Models\\User',21,'auth_token','b9a89be49ce17a91c274bc97e35837f78fa7d3dfdf01eb03a044cf799eaa2917','[\"*\"]',NULL,NULL,'2026-03-31 13:45:03','2026-03-31 13:45:03'),(82,'App\\Models\\User',21,'auth_token','c8162de6509ce66e7f55159479461acc337278e24be9d6c35940317127c4c686','[\"*\"]',NULL,NULL,'2026-03-31 13:45:06','2026-03-31 13:45:06'),(83,'App\\Models\\User',21,'auth_token','f63847f0b9102ddc1f7dd7c9c3a37cade457c5447515e95675c5f2416e84135b','[\"*\"]',NULL,NULL,'2026-03-31 13:45:10','2026-03-31 13:45:10'),(84,'App\\Models\\User',21,'auth_token','592e0db1f53ffca397068c43cab1fea634a2f696aff9535c34b7548c27723e4e','[\"*\"]',NULL,NULL,'2026-03-31 13:45:13','2026-03-31 13:45:13'),(85,'App\\Models\\User',21,'auth_token','b69fcef3fd8ca4e09bd31cedf339dafbb320ad3a8ef0bcd472e439d7845bd003','[\"*\"]','2026-03-31 14:05:11',NULL,'2026-03-31 13:45:40','2026-03-31 14:05:11'),(86,'App\\Models\\User',23,'auth_token','8cbeb836b9b3822b613005aa4d9de0e3e3b6632a1ffca70f128e7ab1f9b89c60','[\"*\"]',NULL,NULL,'2026-03-31 14:05:14','2026-03-31 14:05:14'),(87,'App\\Models\\User',21,'auth_token','1c4d768ed21ea459bfd423fa4be31215c6867c8e2b1eb99543e73c84bb4e8e12','[\"*\"]',NULL,NULL,'2026-03-31 14:06:13','2026-03-31 14:06:13'),(88,'App\\Models\\User',23,'auth_token','01c69972fa0430938fc3cddb049dff88a3bc114e7ca0fb31476df904d6cd70ee','[\"*\"]','2026-04-01 01:30:20',NULL,'2026-03-31 14:13:11','2026-04-01 01:30:20'),(89,'App\\Models\\User',21,'auth_token','1e004b5c667466f4f6fb3a0659406565ffe50f8d71d94063ad4d7ab688d2c547','[\"*\"]','2026-03-31 14:16:29',NULL,'2026-03-31 14:15:41','2026-03-31 14:16:29'),(90,'App\\Models\\User',21,'auth_token','7e6f26ab1a202c4fbe35bc4345cd62630850ca3faae1dc8d27d914db4301d198','[\"*\"]','2026-04-01 07:41:43',NULL,'2026-03-31 14:16:22','2026-04-01 07:41:43'),(91,'App\\Models\\User',23,'auth_token','af5ca199e182630623345a1ab3b37a163233fc90aaef5bf2575e86f9fc239884','[\"*\"]','2026-03-31 14:20:38',NULL,'2026-03-31 14:17:58','2026-03-31 14:20:38'),(92,'App\\Models\\User',23,'auth_token','3a14fd1fff305fb20bf842098ff6a79685d59b881d8824392abc4fa86ecd4bfb','[\"*\"]','2026-03-31 14:23:13',NULL,'2026-03-31 14:20:26','2026-03-31 14:23:13'),(93,'App\\Models\\User',24,'auth_token','4a019a9d3a0fa41ddec55e095f5dd397e47878a11cdd51339d017971113425bf','[\"*\"]','2026-03-31 14:21:31',NULL,'2026-03-31 14:21:24','2026-03-31 14:21:31'),(94,'App\\Models\\User',21,'auth_token','87901cca1af99300fddded4b0b8300a4cc422ef20b95ffd5ec7a5b3d8a1df44a','[\"*\"]','2026-03-31 14:34:30',NULL,'2026-03-31 14:21:48','2026-03-31 14:34:30'),(95,'App\\Models\\User',23,'auth_token','933beafdfb8762eb5420b49feaa9ba95a1a311a5ef48c4c6b01dba565b00b400','[\"*\"]','2026-03-31 14:38:39',NULL,'2026-03-31 14:22:23','2026-03-31 14:38:39'),(96,'App\\Models\\User',21,'auth_token','189d9e5ffe3ce845c0561f1b6d59ce8b52cd610a8c2cce8e4418a21ccac024ef','[\"*\"]',NULL,NULL,'2026-03-31 14:23:17','2026-03-31 14:23:17'),(97,'App\\Models\\User',21,'auth_token','501d4fee2d92d594b70bc4eaf051dc7999656637c0260bebb3ec508fa86f9227','[\"*\"]','2026-03-31 14:30:00',NULL,'2026-03-31 14:23:27','2026-03-31 14:30:00'),(98,'App\\Models\\User',23,'auth_token','1427d0f50c32c9f4d85712fca6ed6a5d2956f64f1ef767540ccff1790999d261','[\"*\"]','2026-04-01 07:53:20',NULL,'2026-03-31 14:30:15','2026-04-01 07:53:20'),(99,'App\\Models\\User',24,'auth_token','d5bbae016f2ebdb348bb890f15200c6a30b47ac5e41b38950becf151a9247469','[\"*\"]','2026-03-31 15:24:09',NULL,'2026-03-31 14:34:48','2026-03-31 15:24:09'),(100,'App\\Models\\User',24,'auth_token','661c0042b9ae25a1d807dd02a8adca123eff9a9a68e800661d88b77e22452085','[\"*\"]','2026-03-31 15:27:11',NULL,'2026-03-31 15:25:16','2026-03-31 15:27:11'),(101,'App\\Models\\User',24,'auth_token','a477bcb77ba9f7f8479c415518396f3bcb07b6a192c8dc2bd5b644f8dbf8ba79','[\"*\"]','2026-03-31 15:28:30',NULL,'2026-03-31 15:27:25','2026-03-31 15:28:30'),(102,'App\\Models\\User',24,'auth_token','a2eeba24e34eeec281c891610a582ebee79d3c2cce414c861d80132e1a11d969','[\"*\"]','2026-03-31 15:28:48',NULL,'2026-03-31 15:28:43','2026-03-31 15:28:48'),(103,'App\\Models\\User',21,'auth_token','d3ce6fa7dcaddfb62bfea47f3a4f529cf74d704b3e10e5c414fe37233a17bdde','[\"*\"]','2026-04-04 07:32:30',NULL,'2026-03-31 15:28:57','2026-04-04 07:32:30'),(104,'App\\Models\\User',23,'auth_token','0ec0bb5b76550bc9a6240b8d974cd154dd93941115aa906c4e3602e101cd3b49','[\"*\"]',NULL,NULL,'2026-04-01 00:07:20','2026-04-01 00:07:20'),(105,'App\\Models\\User',25,'auth_token','eb70bf558b5c7836ca9c4b2146a553385db93e24e27f3154f36f6d50ea82830c','[\"*\"]',NULL,NULL,'2026-04-01 01:30:49','2026-04-01 01:30:49'),(106,'App\\Models\\User',25,'auth_token','eb54ee88184ed62fabb6df0f851c52992bdb00f00016145e1b594d9095e5240e','[\"*\"]','2026-04-01 07:32:31',NULL,'2026-04-01 01:31:12','2026-04-01 07:32:31'),(107,'App\\Models\\User',25,'auth_token','f431071325fcc44f355543691e5e46b41e191c09d79709b53cad7b6da1cdbc24','[\"*\"]',NULL,NULL,'2026-04-01 01:32:46','2026-04-01 01:32:46'),(108,'App\\Models\\User',23,'auth_token','18cccfe80cd0fd4709ffe8492aed8a09441d8a438a2ae2226c8092c3809d73f9','[\"*\"]',NULL,NULL,'2026-04-01 07:32:34','2026-04-01 07:32:34'),(109,'App\\Models\\User',25,'auth_token','d75e33c82c7ce41072fe65f6afff0f886d75018d5f74e03e087fd95882394f32','[\"*\"]',NULL,NULL,'2026-04-01 07:34:03','2026-04-01 07:34:03'),(110,'App\\Models\\User',23,'auth_token','c126da0f1159253e5375af7bf75cf0dde0d1d23d0d9c1c5bcd8e0e26fa20d469','[\"*\"]','2026-04-01 08:01:35',NULL,'2026-04-01 07:39:06','2026-04-01 08:01:35'),(111,'App\\Models\\User',21,'auth_token','f14f92ad5c8ea1c2732ee84d9fd4e2fe9280f790a5a3e91a1ebe0d122779cd6f','[\"*\"]','2026-04-01 07:48:00',NULL,'2026-04-01 07:41:51','2026-04-01 07:48:00'),(112,'App\\Models\\User',21,'auth_token','9830b7afd149638d8ae54220c537b8759fe7240dc55a792cee41eafad326bb7d','[\"*\"]',NULL,NULL,'2026-04-01 07:41:54','2026-04-01 07:41:54'),(113,'App\\Models\\User',21,'auth_token','17d93c9c084bb0c010654e9a5be4b6c26f344adbf57a48ff5509b728661c41d3','[\"*\"]','2026-04-01 07:48:22',NULL,'2026-04-01 07:48:09','2026-04-01 07:48:22'),(114,'App\\Models\\User',21,'auth_token','832d6b393aebfc552263f729d120198c2decf69a699fb1f354d1e52fbf487f6f','[\"*\"]',NULL,NULL,'2026-04-01 07:48:13','2026-04-01 07:48:13'),(115,'App\\Models\\User',23,'auth_token','17d32632baf0dad76d54fc366f85eff1e345278a7e9cb33e62ee65408c67792e','[\"*\"]','2026-04-01 07:54:12',NULL,'2026-04-01 07:49:07','2026-04-01 07:54:12'),(116,'App\\Models\\User',23,'auth_token','99c8ce563b8d1838679d358fed8c4921d871d6e95d5c6b30c02fdbc1fa669d15','[\"*\"]',NULL,NULL,'2026-04-01 07:49:10','2026-04-01 07:49:10'),(117,'App\\Models\\User',23,'auth_token','937d563806ca19621f22025e1af2c09cf9eb2cbc4084142f77800461435487d6','[\"*\"]','2026-04-01 08:47:41',NULL,'2026-04-01 07:53:33','2026-04-01 08:47:41'),(118,'App\\Models\\User',23,'auth_token','dbb662a4e7e93af70abb939ff630e4ccdfed439c0090be438fea00d2b42368bf','[\"*\"]','2026-04-01 08:01:03',NULL,'2026-04-01 07:54:19','2026-04-01 08:01:03'),(119,'App\\Models\\User',23,'auth_token','837f651efe9c2a59a5ad99e024cb3c0b9bb7655789464f2d9c4514ea23dd8be1','[\"*\"]',NULL,NULL,'2026-04-01 07:54:23','2026-04-01 07:54:23'),(120,'App\\Models\\User',23,'auth_token','f9e350d26f2b6e9e861006b6b510742ef6992bcf4a12cefff3d47d64a0f0ca68','[\"*\"]','2026-04-01 08:03:12',NULL,'2026-04-01 08:01:13','2026-04-01 08:03:12'),(121,'App\\Models\\User',25,'auth_token','3a1d5b7bc11c721f0b4a17cefe9fce614aea8e8001d84789a646492545457489','[\"*\"]','2026-04-04 00:15:16',NULL,'2026-04-01 08:02:00','2026-04-04 00:15:16'),(122,'App\\Models\\User',23,'auth_token','ce61a4f6658ad0f6042ff5977141b099562bc964b93a170e33e96c0dc1f41fde','[\"*\"]','2026-04-01 08:03:44',NULL,'2026-04-01 08:03:21','2026-04-01 08:03:44'),(123,'App\\Models\\User',23,'auth_token','e7598d31a08560c2c475bb0ef1cfd8d8a2f9a886049f76e71569e0856fdead63','[\"*\"]','2026-04-01 08:13:50',NULL,'2026-04-01 08:05:31','2026-04-01 08:13:50'),(124,'App\\Models\\User',23,'auth_token','53bf097379b5d6c36ef7f348d36cbea37ea64f25ad28f41d671e699d986f4d51','[\"*\"]',NULL,NULL,'2026-04-01 08:05:35','2026-04-01 08:05:35'),(125,'App\\Models\\User',23,'auth_token','6a2feba311a4d1747b9c371cec190bc0b0883801eed48f9fdbf432e610c1db8f','[\"*\"]',NULL,NULL,'2026-04-01 08:13:57','2026-04-01 08:13:57'),(126,'App\\Models\\User',23,'auth_token','1d531aff723a73a883c310bcaf0f2a31e4ecf7e0c110f15f439b37bd17728823','[\"*\"]','2026-04-01 08:17:27',NULL,'2026-04-01 08:14:01','2026-04-01 08:17:27'),(127,'App\\Models\\User',23,'auth_token','7f4e2b12d722a94924699df54ce917527b091991431e8dd001813db13764013c','[\"*\"]','2026-04-01 08:18:04',NULL,'2026-04-01 08:17:36','2026-04-01 08:18:04'),(128,'App\\Models\\User',23,'auth_token','ecfa6b9576c66f5e182ed8a8586fc85b9b0ea52134a47ab55e382cda511e0f8d','[\"*\"]','2026-04-01 08:20:46',NULL,'2026-04-01 08:18:13','2026-04-01 08:20:46'),(129,'App\\Models\\User',23,'auth_token','e916e1649a68c8a9188f39d7d0ee9504c465ebb78f79efc97ba0f2531d6574b8','[\"*\"]','2026-04-01 08:24:49',NULL,'2026-04-01 08:20:55','2026-04-01 08:24:49'),(130,'App\\Models\\User',23,'auth_token','845adfbc5afeefe36867fbf8365d431d4f489d954012269f0856b357f3942e30','[\"*\"]',NULL,NULL,'2026-04-01 08:20:58','2026-04-01 08:20:58'),(131,'App\\Models\\User',23,'auth_token','a33bb86b4ca47dd8a75f49c4e58e67c2b6ae7c9179421e2ebb93489b4051548f','[\"*\"]','2026-04-01 08:26:23',NULL,'2026-04-01 08:25:05','2026-04-01 08:26:23'),(132,'App\\Models\\User',23,'auth_token','36486b0a306078b5c47195876c00c93583172cc09425273aeb75719e3c307635','[\"*\"]',NULL,NULL,'2026-04-01 08:25:09','2026-04-01 08:25:09'),(133,'App\\Models\\User',25,'auth_token','532142c64f39062aa0d0913ffa6b6b867b69e22cfd1de77adabfea6aa715bd32','[\"*\"]','2026-04-01 08:27:28',NULL,'2026-04-01 08:26:45','2026-04-01 08:27:28'),(134,'App\\Models\\User',21,'auth_token','73943795a9433c1449ce22a3bd8e733ebc5228d04413aed59293379eac3c4322','[\"*\"]','2026-04-01 08:46:28',NULL,'2026-04-01 08:27:39','2026-04-01 08:46:28'),(135,'App\\Models\\User',25,'auth_token','21abd08b54eba32fc7eac85f7bc117dae89e3975ec4b9aacbac5e0f18a2d7bda','[\"*\"]','2026-04-01 08:36:14',NULL,'2026-04-01 08:34:52','2026-04-01 08:36:14'),(136,'App\\Models\\User',23,'auth_token','6ca808f2910ac44d335c2e81bb5f0c12686a4acf9dc01db5e639c70e97375470','[\"*\"]','2026-04-01 08:36:38',NULL,'2026-04-01 08:36:25','2026-04-01 08:36:38'),(137,'App\\Models\\User',23,'auth_token','1dbb99499092f9273c57f16aa98f5f11f4cc83b888ff9c40c5006ef5808272f6','[\"*\"]','2026-04-01 08:48:42',NULL,'2026-04-01 08:46:40','2026-04-01 08:48:42'),(138,'App\\Models\\User',25,'auth_token','6ed88d8c577d9941d7243f7b63d48d04a9893872f141b2fe776d1f8a060a7ebe','[\"*\"]','2026-04-04 00:16:02',NULL,'2026-04-01 08:47:56','2026-04-04 00:16:02'),(139,'App\\Models\\User',23,'auth_token','966a33feaf33542ce4ca5edd726ebcae017eac9fdb816077f02786e2ef7ce68c','[\"*\"]','2026-04-04 00:16:26',NULL,'2026-04-04 00:15:20','2026-04-04 00:16:26'),(140,'App\\Models\\User',23,'auth_token','ae756fd10d2d892ab555c1f8c4175268b7ac9abda7bff8bda4e26bd25b7f17eb','[\"*\"]',NULL,NULL,'2026-04-04 00:15:23','2026-04-04 00:15:23'),(141,'App\\Models\\User',23,'auth_token','b75948402801ed07ef88d84f50405730bda4a45100a454af4354a0069f155e54','[\"*\"]',NULL,NULL,'2026-04-04 00:15:27','2026-04-04 00:15:27'),(142,'App\\Models\\User',23,'auth_token','dc21a10569b0edb567d224a964b85683946b898ec8c79c59692cc1a6c1c2a6a9','[\"*\"]','2026-04-04 00:17:04',NULL,'2026-04-04 00:16:39','2026-04-04 00:17:04'),(143,'App\\Models\\User',23,'auth_token','abaf943e5cb9cfa97559f549401eea55084c920f3737c29b714b136066cc9730','[\"*\"]',NULL,NULL,'2026-04-04 00:16:43','2026-04-04 00:16:43'),(144,'App\\Models\\User',23,'auth_token','64493de206d7a63027af7b14615f8f75b7c4337dd27bf6b2f16724f3e6140f9c','[\"*\"]','2026-04-04 00:59:46',NULL,'2026-04-04 00:17:18','2026-04-04 00:59:46'),(145,'App\\Models\\User',24,'auth_token','a90f9cfa0ed6e8297824bb2262292d367ff95672ccd2df0707dc36e1904863df','[\"*\"]','2026-04-04 07:32:38',NULL,'2026-04-04 07:32:11','2026-04-04 07:32:38'),(146,'App\\Models\\User',24,'auth_token','679635035c6ccd99d2f9a59659a67e552d59eb15d28207db812cd47ed6ba943a','[\"*\"]',NULL,NULL,'2026-04-04 07:32:15','2026-04-04 07:32:15'),(147,'App\\Models\\User',24,'auth_token','10a954130a61a945006bfef3502369808a464b0559aecb47135e420eaa775756','[\"*\"]',NULL,NULL,'2026-04-04 07:32:18','2026-04-04 07:32:18'),(148,'App\\Models\\User',24,'auth_token','77451c18b7a1294b4ad301e0129d60c4a5f65c02c0444d5e34c3bad848b12b07','[\"*\"]',NULL,NULL,'2026-04-04 07:32:21','2026-04-04 07:32:21'),(149,'App\\Models\\User',24,'auth_token','dbf7d17d461cd2babd79c40ff728faf3022f42103915254362ca91b27ad80d0d','[\"*\"]',NULL,NULL,'2026-04-04 07:32:25','2026-04-04 07:32:25'),(150,'App\\Models\\User',24,'auth_token','326a58dd6dff6e3d0a22eadbb8239dd2c7f8e1fcc5feb811ca8fb970876645cb','[\"*\"]',NULL,NULL,'2026-04-04 07:32:28','2026-04-04 07:32:28'),(151,'App\\Models\\User',24,'auth_token','989489e3afe4e33147bbc6360173fdf8fd8bc7fe470be911da11cf31cde660ba','[\"*\"]','2026-04-04 18:39:42',NULL,'2026-04-04 07:32:48','2026-04-04 18:39:42'),(152,'App\\Models\\User',24,'auth_token','f05f0942d62bec7207565432cb27fe1d25d90fb0edf1ad04b94b580fc01b83c7','[\"*\"]','2026-04-04 08:02:04',NULL,'2026-04-04 07:54:08','2026-04-04 08:02:04');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_comments`
--

DROP TABLE IF EXISTS `post_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_comments`
--

LOCK TABLES `post_comments` WRITE;
/*!40000 ALTER TABLE `post_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_images`
--

DROP TABLE IF EXISTS `post_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_images`
--

LOCK TABLES `post_images` WRITE;
/*!40000 ALTER TABLE `post_images` DISABLE KEYS */;
INSERT INTO `post_images` VALUES (1,8,'https://example.com/a.jpg','2026-03-16 15:16:30'),(2,8,'https://example.com/b.jpg','2026-03-16 15:16:30'),(3,9,'https://example.com/a.jpg','2026-03-16 15:18:14'),(4,9,'https://example.com/b.jpg','2026-03-16 15:18:14'),(5,10,'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee','2026-03-30 09:03:34'),(6,10,'https://images.unsplash.com/photo-1490730141103-6cac27aaab94','2026-03-30 09:03:34'),(7,10,'https://images.unsplash.com/photo-1518791841217-8f162f1e1131','2026-04-02 08:42:32'),(8,11,'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee','2026-04-02 08:43:43'),(9,11,'https://images.unsplash.com/photo-1490730141103-6cac27aaab94','2026-04-02 08:43:43');
/*!40000 ALTER TABLE `post_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_likes`
--

DROP TABLE IF EXISTS `post_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_likes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_likes`
--

LOCK TABLES `post_likes` WRITE;
/*!40000 ALTER TABLE `post_likes` DISABLE KEYS */;
INSERT INTO `post_likes` VALUES (3,5,4,'2025-12-22 16:00:04'),(4,8,20,'2026-03-17 07:12:13');
/*!40000 ALTER TABLE `post_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_shares`
--

DROP TABLE IF EXISTS `post_shares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_shares` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_shares`
--

LOCK TABLES `post_shares` WRITE;
/*!40000 ALTER TABLE `post_shares` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_shares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `caption` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `like_count` int DEFAULT '0',
  `comment_count` int DEFAULT '0',
  `status` enum('active','hidden') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (2,2,'Freedom đẹp bá cháy!','2025-12-09 10:41:02',0,0,'active'),(3,3,'Exia Repair II vừa hoàn thành.','2025-12-09 10:41:02',0,0,'active'),(5,4,'đẹp quá ','2025-12-22 16:00:02',0,0,'active'),(8,21,'Bai viet moi','2026-03-16 15:16:30',1,0,'active'),(11,20,'Hôm nay lên bài đầu tiên, chúc mọi người cuối tuần vui vẻ!','2026-04-02 08:43:43',0,0,'active');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_thumbnail` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id_idx` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (14,57,'images-1774966298512-685021247.jpeg',0,'2026-03-31 14:11:39'),(15,2,'images-1774967382547-486219082.jpeg',0,'2026-03-31 14:29:43');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `category_id` int NOT NULL,
  `subcategory_id` int NOT NULL,
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tag` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `stock` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2,'Gundam Freedom HG',450000.00,'Mô hình HG siêu đẹp.',1,1,'Hà Nội','null','2025-12-09 10:41:02',5),(3,'Gundam Barbatos MG',880000.00,'Barbatos MG chi tiết cao.',1,3,'TP.HCM','Giảm 30%','2025-12-09 10:41:02',100),(4,'Gundam Exia Repair II',560000.00,'Phiên bản Repair II từ Gundam 00.',1,1,'Đà Nẵng',NULL,'2025-12-09 10:41:02',200),(5,'Gundam Unicorn Destroy Mode HG ',1250000.00,'Unicorn chuyển đổi dạng Destroy Mode cực đẹp.',1,1,'TP.HCM','Yêu thích','2025-12-09 11:32:07',0),(6,'Gundam Wing Zero Custom',1100000.00,'Wing Zero bản cánh thiên thần, iconic.',1,3,'Hà Nội','Yêu thích','2025-12-09 11:32:07',0),(7,'Gundam Astray Red Frame',980000.00,'Astray Red Frame với katana đặc trưng.',1,3,'Đà Nẵng','Yêu thích','2025-12-09 11:32:07',0),(8,'Gundam Dynames HG',520000.00,'Dynames trang bị súng bắn tỉa.',1,1,'Hải Phòng','Yêu thích','2025-12-09 11:32:07',0),(9,'Gundam Heavyarms',750000.00,'Heavyarms vũ khí hỏa lực mạnh mẽ.',1,1,'Cần Thơ','Yêu thích','2025-12-09 11:32:07',0),(10,'Gundam Aerial HG',480000.00,'Aerial từ series Witch from Mercury.',1,1,'Hà Nội','New','2025-12-09 11:32:07',0),(11,'Gundam Calibarn HG ',680000.00,'Calibarn bản mới nhất cực hot.',1,1,'Đà Nẵng','New','2025-12-09 11:32:07',0),(12,'Gundam Nu RX-93',1350000.00,'Nu Gundam với hệ thống funnels.',1,3,'TP.HCM','New','2025-12-09 11:32:07',0),(13,'Gundam Zeta Z',990000.00,'Zeta với khả năng transform.',1,3,'Hà Nội','New','2025-12-09 11:32:07',0),(14,'Gundam Providence',1150000.00,'Providence với vũ khí DRAGOON system.',1,3,'Huế','New','2025-12-09 11:32:07',0),(15,'HG RX-78-2 Gundam Revive',350000.00,'HG RX-78-2 bản Revive nổi tiếng, dễ ráp, đẹp.',1,1,'TP.HCM','new','2025-12-11 11:32:52',0),(16,'HG Barbatos Lupus',420000.00,'Barbatos Lupus tỉ lệ HG đẹp, nhiều người săn.',1,1,'Đà Nẵng','Yêu thích','2025-12-11 11:32:52',0),(17,'HG Aerial Rebuild',390000.00,'HG Aerial Rebuild chi tiết rất tốt.',1,1,'Hà Nội','new','2025-12-11 11:32:52',0),(18,'RG Sazabi',1450000.00,'RG Sazabi kích thước lớn, độ chi tiết cực cao.',1,2,'TP.HCM','Yêu thích','2025-12-11 11:32:52',0),(19,'RG Nu Gundam',1350000.00,'RG Nu Gundam – một trong những RG đẹp nhất.',1,2,'Hải Phòng','new','2025-12-11 11:32:52',0),(20,'RG Strike Freedom',1250000.00,'Strike Freedom RG với bộ cánh vàng tuyệt đẹp.',1,2,'Cần Thơ','Yêu thích','2025-12-11 11:32:52',0),(21,'MG Freedom Gundam 2.0',1150000.00,'Freedom MG 2.0 – đẹp, cân đối, pose tốt.',1,3,'Hà Nội','Yêu thích','2025-12-11 11:32:52',0),(22,'MG Exia',980000.00,'MG Exia, build dễ, khớp chắc, màu đẹp.',1,3,'TP.HCM','new','2025-12-11 11:32:52',0),(23,'MG Barbatos',1450000.00,'MG Barbatos chuẩn anime, cơ khí đẹp.',1,3,'Đà Nẵng','Yêu thích','2025-12-11 11:32:52',0),(24,'PG Gundam Unicorn',6500000.00,'PG Unicorn – mô hình cực lớn và cực đẹp.',1,4,'Hà Nội','Yêu thích','2025-12-11 11:32:52',0),(25,'PG Strike Gundam',6200000.00,'Perfect Grade Strike – tỉ lệ khổng lồ, chi tiết cao.',1,4,'TP.HCM','new','2025-12-11 11:32:52',0),(26,'SD EX-Standard RX-78-2',180000.00,'SD EX tiêu chuẩn, dễ thương, build nhanh.',1,5,'Hà Nội','new','2025-12-11 11:32:52',0),(27,'SD Barbatos Lupus',190000.00,'SD Barbatos dễ thương, giá rẻ.',1,5,'Cần Thơ','Yêu thích','2025-12-11 11:32:52',0),(28,'SD Wing Zero Custom',200000.00,'SD Wing Zero Custom cánh đẹp, dễ trưng bày.',1,5,'Đà Nẵng','new','2025-12-11 11:32:52',0),(57,'gundam test updated',12.00,'xxxxxxx',2,1,'Viet Nam','test updated','2026-03-31 14:11:05',100);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategories`
--

LOCK TABLES `subcategories` WRITE;
/*!40000 ALTER TABLE `subcategories` DISABLE KEYS */;
INSERT INTO `subcategories` VALUES (1,'HG',1),(2,'RG',1),(3,'MG',1),(4,'PG',1),(5,'SD',1),(6,'Figure 1/6',2),(8,'Henshin Belt',5),(9,'Item Henshin',5);
/*!40000 ALTER TABLE `subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `role` enum('admin','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'athrun','123456','athrun@gmail.com','uploads/avatars/athrun.png','2025-12-09 10:41:01','user',NULL,NULL),(10,'new_username','$2y$12$DDr1UNBDh/nadpPy9OYu9u27rP3nynCKsvUOP0BR3ZWQH5GthicHi','new_email@example.com',NULL,'2026-03-13 05:08:34','user','0988888888','Hồ chí minh'),(12,'user 123','$2y$12$8GiiZTgU0BxI7QXxw3RY.OJ4AkrOFaiSzOZrVQlCKAsr/xEFlPoV6','abc@gmail.com',NULL,'2026-03-13 08:29:29','user','064987513','cao lỗ'),(13,'user stu','$2b$12$r0vX8phXhKOwARE2xU1BNOre4r/ONfu3vzpixfQV0Mea9qecp1Us6','stu@gmail.com',NULL,'2026-03-13 08:36:13','admin','0123466789','180 cao lỗ'),(19,'dsda','$2b$12$pg1FrIuoEycpCVkTb/q09e3kXII.Yk6H5VsSKewXCkkDppR10W/Pe','duongnhatthanhaz09@gmail.com',NULL,'2026-03-14 11:27:19','user','0325731504','131/3 minh phụng p9 q6'),(20,'mv','$2y$12$OC91pGAIPPt6JgOMk8kL4OzibFdYHzRZyrFHKrnXhXO5WxcJhFWUO','mv_test_20260316_0802@gmail.com',NULL,'2026-03-16 08:00:37','user',NULL,NULL),(21,'Admin STU','$2y$12$jj81IzmLhJGPfFCP1ZHC9O2TvRELOj5tD.kE6YFtEYzo1S.HcWhA6','admin@example.com',NULL,'2026-03-16 08:02:04','admin',NULL,NULL),(23,'user defff','$2y$12$xlJFyzIj00Lbxco6ffJF5enpqYdMRAWs7rlrZskU3o149QOe8CFQa','def@gmail.com',NULL,'2026-03-18 09:14:15','user','01234567899999','180 Cao Lỗ'),(24,'user','$2y$12$K.Tq5.GrM2kcuLFcTuVrLegLSOwHGXmFFyHrLfxw9QhwkkxWo6xDW','thanhdatle.it@gmail.com',NULL,'2026-03-31 12:59:20','user','0222333444','180 cao lo'),(25,'xuan truong','$2y$12$fJjuqjrYxSyQbepAeY/zfO6c.BT1CM2tzZ2wy4IINDCsUIOmT29ca','xtruong@gmail.com',NULL,'2026-04-01 01:30:48','user',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-05  1:40:24
