-- CreateTable
CREATE TABLE `UserBalanceSnapshot` (
    `userBalanceId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `snapshotDate` DATETIME(3) NOT NULL,
    `balance` DECIMAL(12, 2) NOT NULL,

    INDEX `UserBalanceSnapshot_userId_snapshotDate_idx`(`userId`, `snapshotDate`),
    UNIQUE INDEX `UserBalanceSnapshot_userId_snapshotDate_key`(`userId`, `snapshotDate`),
    PRIMARY KEY (`userBalanceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserBalanceSnapshot` ADD CONSTRAINT `UserBalanceSnapshot_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
