"use client";

import { useState, useEffect } from "react";
import { CompanySearch } from "@/components/company/company-search";
import { CompanyProfileCard } from "@/components/company/company-profile-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface LinkedCompany {
  id: string;
  companyName: string;
  companyNumber: string;
  companyStatus: string | null;
  companyType: string | null;
  dateOfCreation: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  locality: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
  sicCodes: { code: string; description: string | null; section: string | null }[];
}

export default function CompanyPage() {
  const [linkedCompany, setLinkedCompany] = useState<LinkedCompany | null>(null);
  const [previewCompany, setPreviewCompany] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.company) setLinkedCompany(data.company);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectCompany = async (companyNumber: string) => {
    setIsFetchingPreview(true);
    try {
      const res = await fetch(`/api/company/${companyNumber}`);
      if (res.ok) {
        const data = await res.json();
        setPreviewCompany(data);
      }
    } catch (err) {
      console.error("Failed to fetch company profile:", err);
    } finally {
      setIsFetchingPreview(false);
    }
  };

  const handleLinkCompany = async () => {
    if (!previewCompany) return;
    setIsLinking(true);
    try {
      const res = await fetch("/api/company/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyNumber: (previewCompany as { company_number?: string }).company_number,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setLinkedCompany(data);
        setPreviewCompany(null);
      }
    } catch (err) {
      console.error("Failed to link company:", err);
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlinkCompany = async () => {
    try {
      const res = await fetch("/api/company/link", { method: "DELETE" });
      if (res.ok) {
        setLinkedCompany(null);
      }
    } catch (err) {
      console.error("Failed to unlink company:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Company</h1>
        <p className="text-gray-600 mt-1">
          Link your company to get personalised grant recommendations based on
          your industry and business profile.
        </p>
      </div>

      {linkedCompany ? (
        <div className="space-y-4">
          <CompanyProfileCard company={linkedCompany} />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setLinkedCompany(null)}>
              Change company
            </Button>
            <Button variant="danger" onClick={handleUnlinkCompany}>
              Unlink company
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CompanySearch onSelect={handleSelectCompany} />
          </Card>

          {isFetchingPreview && (
            <div className="flex items-center justify-center py-8">
              <Spinner size="lg" />
            </div>
          )}

          {previewCompany && !isFetchingPreview && (
            <div className="space-y-4">
              <Card>
                <h3 className="text-lg font-semibold mb-3">
                  {(previewCompany as { company_name?: string }).company_name}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Number: </span>
                    <span className="text-gray-900">{(previewCompany as { company_number?: string }).company_number}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status: </span>
                    <span className="text-gray-900">{(previewCompany as { company_status?: string }).company_status}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Type: </span>
                    <span className="text-gray-900">{(previewCompany as { company_type?: string }).company_type}</span>
                  </div>
                  {(previewCompany as { sic_codes?: string[] }).sic_codes && (
                    <div>
                      <span className="text-gray-500">SIC Codes: </span>
                      <span className="text-gray-900">
                        {((previewCompany as { sic_codes?: string[] }).sic_codes ?? []).join(", ")}
                      </span>
                    </div>
                  )}
                </div>
                <Button onClick={handleLinkCompany} isLoading={isLinking}>
                  Link this company to my account
                </Button>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
