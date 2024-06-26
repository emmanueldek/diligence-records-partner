import {
  TColumn,
  TOrgFinancialStatements,
  TTableOrgFinancialStatements,
} from "@/types/organizationTypes";
// import AvailableDocuments from "./AvailableDocuments";
import { GoPaperclip } from "react-icons/go";
import React, { useState } from "react";
import Home from "@/pages/viewDoc/Home";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { FaDownload } from "react-icons/fa6";
import { RECORDS_URLS } from "@/utils/backendURLs";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

type TProps = {
  data?: TOrgFinancialStatements[];
};

const columns: TColumn[] = [
  { field: "year", header: "Year" },
  // { field: "audFinancials", header: "Audited Financials" },
  { field: "audBy", header: "Audited by" },
  { field: "source", header: "Source" },
  { field: "audFinancials", header: "Attachment" },
];

const FinancialStatementsTab: React.FC<TProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const userAuth = localStorage.getItem("authToken") as string;
  const [loading, setLoading] = useState(false);

  console.log(data);

  let convertedUrl = "";
  let Urls: any = [];

  console.log(data);

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

  const contactData: TTableOrgFinancialStatements[] = data
    ? data.map((el, i) => {
        el.fsDocuments.forEach((doc: any) => {
          if (typeof doc == "string") {
            convertedUrl = doc;
          } else if (typeof doc == "object") {
            doc.forEach((doc2: any) => {
              if (typeof doc2 == "string") {
                convertedUrl = doc2;
              } else if (typeof doc2 == "object") {
                doc2.forEach((doc3: any) => {
                  convertedUrl = doc3;
                });
              }
            });
          }
        });
        Urls.push(convertedUrl);
        return {
          year: el?.year,
          audFinancials: (
            <div className="w-[300px] overflow-hidden truncate">
              <button onClick={() => downloadPdf(Urls[i])}>
                <FaDownload />
              </button>
            </div>
          ),
          audBy: el?.audBy,
          source: (
            <a href={el?.source} target="_blank" className="text-blue-600">
              {el?.source}{" "}
            </a>
          ),
          fsDocuments: (
            <div>
              <GoPaperclip />
            </div>
          ),
        };
      })
    : [];

  return (
    <div className="w-full">
      <p
        onClick={() => setCurrentPage(1)}
        className="flex items-center gap-1 cursor-pointer text-[0.9rem] mb-3"
      >
        {" "}
        <HiArrowNarrowLeft />
        Go Back
      </p>
      {currentPage === 1 ? (
        <>
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
                {contactData &&
                  contactData.map((row, i) => (
                    <tr
                      key={i}
                      className="h-[50px] border-b-[1px] text-sm text-[#151515] font-[500]"
                    >
                      {columns?.map((col: TColumn, i) => (
                        <td key={i} className="pl-4 font-light text-textGrey">
                          {row[col.field as keyof TTableOrgFinancialStatements]}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* <div className="mt-6 w-full">
            <AvailableDocuments data={data} type="pdf" />
          </div> */}
        </>
      ) : (
        <Home fileUrl={""} />
      )}
      {loading && <Loader detail="Fetching Record..." />}
    </div>
  );
};

export default FinancialStatementsTab;
