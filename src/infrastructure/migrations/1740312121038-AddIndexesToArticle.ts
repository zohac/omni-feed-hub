// import { MigrationInterface, QueryRunner } from "typeorm";
//
// export class AddIndexesToArticle1740312121038 implements MigrationInterface {
//
//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`
//           -- Index GIN pour accélérer la recherche sur les tags
//           CREATE INDEX IF NOT EXISTS idx_article_tags ON article USING GIN (tags);
//
//           -- Index BTREE pour accélérer les tris par date
//           CREATE INDEX IF NOT EXISTS idx_article_publication ON article ("publicationAt" DESC);
//
//           -- Index GIN pour optimiser la recherche dans metadata
//           CREATE INDEX IF NOT EXISTS idx_article_metadata ON article USING GIN (metadata jsonb_path_ops);
//         `);
//     }
//
//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`
//           DROP INDEX IF EXISTS idx_article_tags;
//           DROP INDEX IF EXISTS idx_article_publication;
//           DROP INDEX IF EXISTS idx_article_metadata;
//         `);
//     }
//
// }
