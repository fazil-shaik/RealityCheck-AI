import {db} from './db/connect'
import { users } from './db/schema/schema'
export default async function Home(){
  const allUsers = await db.select().from(users);
  return (
    <>
      <h1>Welcome to reality check</h1>
      <pre>{JSON.stringify(allUsers, null, 2)}</pre>
    </>
  );
}
