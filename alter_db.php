<?php
require "app/config.php";

$queries = [
    "ALTER TABLE comenzi ADD COLUMN customer_id INT NULL AFTER id",
    "ALTER TABLE comenzi ADD COLUMN company_name VARCHAR(255) NULL AFTER customer_phone",
    "ALTER TABLE comenzi ADD COLUMN cui VARCHAR(50) NULL AFTER company_name",
    "ALTER TABLE comenzi ADD COLUMN reg_com VARCHAR(50) NULL AFTER cui",
    "ALTER TABLE comenzi ADD COLUMN billing_address VARCHAR(255) NULL AFTER shipping_county",
    "ALTER TABLE comenzi ADD COLUMN billing_city VARCHAR(100) NULL AFTER billing_address",
    "ALTER TABLE comenzi ADD COLUMN billing_county VARCHAR(100) NULL AFTER billing_city"
];

foreach ($queries as $q) {
    try {
        $pdo->exec($q);
        echo "Success: $q\n";
    } catch (PDOException $e) {
        if ($e->getCode() == '42S21') { // Duplicate column
            echo "Already exists: $q\n";
        } else {
            echo "Error: " . $e->getMessage() . " for query $q\n";
        }
    }
}
