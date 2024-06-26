import { TColumn, TOrgTaxCompliance } from "@/types/organizationTypes";
import { FaDownload } from "react-icons/fa6";
// import { PrimaryBtn } from "@/components";
import { RECORDS_URLS } from "@/utils/backendURLs";
import { useState } from "react";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

type TProps = {
  data?: TOrgTaxCompliance[];
};

const columns: TColumn[] = [
  { field: "year", header: "Year" },
  { field: "fillingStatus", header: "Filing Status" },
  { field: "totalTaxLiability", header: "Total Tax Liability" },
  { field: "tcDocuments", header: "Attachment" },
];

const TaxComplianceTab: React.FC<TProps> = ({ data }) => {
  const userAuth = localStorage.getItem("authToken") as string;

  const [loading, setLoading] = useState(false);

  const downloadPdf = async (fileName: string | undefined) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${RECORDS_URLS.BASE_URL}${RECORDS_URLS.RETRIEVEPDF}?fileName=${fileName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
            Authorization: `Bearer ${userAuth}`,
          },
        },
      );

      if (response.status === 404) {
        setLoading(false);
        toast.error("File not found");
        return;
      }
      const data = await response.blob();
      setLoading(false);
      const hrefUrl = URL.createObjectURL(data);
      window.open(hrefUrl, "_blank");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full">
      <div className="w-full scrollbar-hide overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border-collapse border-spacing-0">
          <thead className="text-xs text-grey-400 bg-grey-50">
            <tr className=" h-[45px] px-7 text-left">
              {columns &&
                columns.map((head, i) => (
                  <th key={i} className="pl-4">
                    {head.header}{" "}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody className="w-full">
            {data &&
              data.map((row, i) => (
                <tr
                  key={i}
                  className="h-[40px]  text-sm text-[#151515] font-[500]"
                >
                  {columns?.map((col: TColumn, i) => (
                    <>
                      {col.field === "tcDocuments" ? (
                        <td className="w-[100px] overflow-hidden truncate flex justify-center h-full mt-3">
                          {" "}
                          <button onClick={() => downloadPdf(row.tcDocuments)}>
                            <FaDownload />
                          </button>
                        </td>
                      ) : (
                        <td key={i} className="pl-4 font-light text-textGrey">
                          {row[col.field as keyof TOrgTaxCompliance]}
                        </td>
                      )}
                    </>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* <div className="mt-6 w-full">
        <div className="w-full">
          <div className="border-b border-grey-50 pb-3">
            <p className="font-bold text-grey-900 text-xl">Documents</p>
          </div>

          <div className="flex flex-wrap gap-4 my-4">
            {data?.map((doc, index) => {
              return (
                <div
                  key={`${index}--doc`}
                  className="w-full sm:w-[190px] md:w-[250px]"
                >
                  <div className="w-full h-[160px] bg-grey-50 rounded-md overflow-hidden group">
                    <button
                      onClick={() => {
                        downloadPdf(doc.tcDocuments);
                      }}
                    >
                      <div className="hidden h-full transition-all group-hover:flex justify-center items-center group-hover:bg-grey-200">
                        <PrimaryBtn text="open" />
                      </div>
                    </button>
                  </div>

                  <h4 className="font-bold leading-[20px] mt-3 mb-1 overflow-auto truncate text-center">
                    {doc.year}
                  </h4>
                  <p className="font-light text-grey-400 text-sm leading-[20px]"></p>
                </div>
              );
            })}
          </div>
        </div>
      </div> */}
      {loading && <Loader detail="Fetching Record..." />}
    </div>
  );
};

export default TaxComplianceTab;
