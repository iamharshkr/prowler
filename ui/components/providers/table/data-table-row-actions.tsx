"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  AddNoteBulkIcon,
  DeleteDocumentBulkIcon,
  EditDocumentBulkIcon,
} from "@nextui-org/shared-icons";
import { Row } from "@tanstack/react-table";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { checkConnectionProvider } from "@/actions/providers/providers";
import { VerticalDotsIcon } from "@/components/icons";
import { CustomAlertModal } from "@/components/ui/custom";

import { EditForm } from "../forms";
import { DeleteForm } from "../forms/delete-form";

interface DataTableRowActionsProps<ProviderProps> {
  row: Row<ProviderProps>;
}
const iconClasses =
  "text-2xl text-default-500 pointer-events-none flex-shrink-0";

export function DataTableRowActions<ProviderProps>({
  row,
}: DataTableRowActionsProps<ProviderProps>) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const providerId = (row.original as { id: string }).id;
  const providerType = (row.original as any).attributes?.provider;
  const providerAlias = (row.original as any).attributes?.alias;
  const providerSecretId =
    (row.original as any).relationships?.secret?.data?.id || null;

  const handleTestConnection = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("providerId", providerId);
    await checkConnectionProvider(formData);
    setLoading(false);
  };

  const hasSecret = (row.original as any).relationships?.secret?.data;

  return (
    <>
      <CustomAlertModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit Provider Alias"
      >
        <EditForm
          providerId={providerId}
          providerAlias={providerAlias}
          setIsOpen={setIsEditOpen}
        />
      </CustomAlertModal>
      <CustomAlertModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your provider account and remove your data from the server."
      >
        <DeleteForm providerId={providerId} setIsOpen={setIsDeleteOpen} />
      </CustomAlertModal>

      <div className="relative flex items-center justify-end gap-2">
        <Dropdown
          className="shadow-xl dark:bg-prowler-blue-800"
          placement="bottom"
        >
          <DropdownTrigger>
            <Button isIconOnly radius="full" size="sm" variant="light">
              <VerticalDotsIcon className="text-default-400" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Actions" color="default" variant="flat">
            <DropdownSection title="Actions">
              <DropdownItem
                key={hasSecret ? "update" : "add"}
                description={
                  hasSecret
                    ? "Update the provider credentials"
                    : "Add the provider credentials"
                }
                textValue={hasSecret ? "Update Credentials" : "Add Credentials"}
                startContent={<EditDocumentBulkIcon className={iconClasses} />}
                onPress={() =>
                  router.push(
                    `/providers/${hasSecret ? "update" : "add"}-credentials?type=${providerType}&id=${providerId}${providerSecretId ? `&secretId=${providerSecretId}` : ""}`,
                  )
                }
                closeOnSelect={true}
              >
                {hasSecret ? "Update Credentials" : "Add Credentials"}
              </DropdownItem>
              <DropdownItem
                key="new"
                description={
                  hasSecret && !loading
                    ? "Check the provider connection"
                    : loading
                      ? "Checking provider connection"
                      : "Add credentials to test the connection"
                }
                textValue="Check Connection"
                startContent={<AddNoteBulkIcon className={iconClasses} />}
                onPress={handleTestConnection}
                isDisabled={!hasSecret || loading}
                closeOnSelect={false}
              >
                {loading ? "Testing..." : "Test Connection"}
              </DropdownItem>
              <DropdownItem
                key="edit"
                description="Allows you to edit the provider"
                textValue="Edit Provider"
                startContent={<EditDocumentBulkIcon className={iconClasses} />}
                onPress={() => setIsEditOpen(true)}
                closeOnSelect={true}
              >
                Edit Provider Alias
              </DropdownItem>
            </DropdownSection>
            <DropdownSection title="Danger zone">
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                description="Delete the provider permanently"
                textValue="Delete Provider"
                startContent={
                  <DeleteDocumentBulkIcon
                    className={clsx(iconClasses, "!text-danger")}
                  />
                }
                onPress={() => setIsDeleteOpen(true)}
                closeOnSelect={true}
              >
                Delete Provider
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
}
