import Image from "next/image";
import Dashboard from './dashboard/page.js'
// import Summary from "./summary/page.js";
import { ExpenseContext } from "./dashboard/components/ExpenseContext.js";


export default function Home() {
  const { expenses } = useContext(ExpenseContext);
  console.log(expenses)
  return (
    <div>
      <Dashboard />
      {/* <Summary /> */}

    </div>
  );
}
