import { columns, Payment } from "./column";
import { DataTable } from "../../../components/data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "PAY-8219",
      amount: 1250,
      status: "success",
      email: "ritik.kumar@gmail.com",
    },
    {
      id: "PAY-8219",
      amount: 1250,
      status: "success",
      email: "ritik.kumar@gmail.com",
    },
    {
      id: "PAY-4432",
      amount: 4500,
      status: "pending",
      email: "sumit.singh@outlook.com",
    },
    {
      id: "PAY-9102",
      amount: 890,
      status: "failed",
      email: "neha.sharma@yahoo.com",
    },
    {
      id: "PAY-1120",
      amount: 15400,
      status: "processing",
      email: "vikas.ayur@amaze.in",
    },
    {
      id: "PAY-5567",
      amount: 2100,
      status: "success",
      email: "priya.patel@gmail.com",
    },
    {
      id: "PAY-3341",
      amount: 675,
      status: "success",
      email: "amit.verma@gmail.com",
    },
    {
      id: "PAY-7789",
      amount: 12000,
      status: "pending",
      email: "rahul.mehta@corp.in",
    },
    {
      id: "PAY-2234",
      amount: 350,
      status: "failed",
      email: "sanjana.rao@gmail.com",
    },
    {
      id: "PAY-9901",
      amount: 5600,
      status: "success",
      email: "deepak.gupta@amaze.in",
    },
    {
      id: "PAY-1288",
      amount: 1850,
      status: "processing",
      email: "ananya.das@live.com",
    },
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10 px-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
