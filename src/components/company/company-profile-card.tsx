import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SicCodeBadges } from "./sic-code-badges";
import { formatDate } from "@/lib/utils";

interface CompanyProfile {
  companyName: string;
  companyNumber: string;
  companyStatus?: string | null;
  companyType?: string | null;
  dateOfCreation?: Date | string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  locality?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  sicCodes: { code: string; description?: string | null; section?: string | null }[];
}

export function CompanyProfileCard({ company }: { company: CompanyProfile }) {
  const address = [
    company.addressLine1,
    company.addressLine2,
    company.locality,
    company.region,
    company.postalCode,
    company.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <CardTitle>{company.companyName}</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Company No. {company.companyNumber}
          </p>
        </div>
        {company.companyStatus && (
          <Badge
            variant={
              company.companyStatus === "active" ? "green" : "default"
            }
          >
            {company.companyStatus}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {company.companyType && (
          <div>
            <dt className="font-medium text-gray-500">Company Type</dt>
            <dd className="mt-1 text-gray-900">{company.companyType}</dd>
          </div>
        )}
        {company.dateOfCreation && (
          <div>
            <dt className="font-medium text-gray-500">Incorporated</dt>
            <dd className="mt-1 text-gray-900">
              {formatDate(company.dateOfCreation)}
            </dd>
          </div>
        )}
        {address && (
          <div className="md:col-span-2">
            <dt className="font-medium text-gray-500">
              Registered Address
            </dt>
            <dd className="mt-1 text-gray-900">{address}</dd>
          </div>
        )}
      </div>

      {company.sicCodes.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500 mb-2">
            SIC Codes (Industry Classification)
          </p>
          <SicCodeBadges sicCodes={company.sicCodes} />
        </div>
      )}
    </Card>
  );
}
