/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_categoryId_fkey`;

-- DropIndex
DROP INDEX `Transaction_categoryId_fkey` ON `Transaction`;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `categoryId`,
    ADD COLUMN `category` ENUM('SALARIO', 'FREELANCER', 'INVESTIMENTOS', 'PRESENTE', 'REEMBOLSO', 'ALIMENTACAO', 'MORADIA', 'TRANSPORTE', 'LAZER', 'EDUCACAO', 'SAUDE', 'CONTAS', 'OUTROS') NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Category`;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
