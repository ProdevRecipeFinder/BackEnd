import { createConnection, getConnection } from 'typeorm';
import typeormConfig from '../../../typeorm-config';

const connection = {
    async create() {
        await createConnection(typeormConfig);
    },

    async close() {
        await getConnection().close();
    },

    async clear() {
        const connection = getConnection();
        const entities = connection.entityMetadatas;

        entities.forEach(async (entity) => {
            const repository = connection.getRepository(entity.name);
            await repository.query(`DELETE FROM ${entity.tableName}`);
        });
    },
};
export default connection;
