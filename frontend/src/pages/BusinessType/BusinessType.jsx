import React, { useState } from 'react'
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Button from '../../components/ui/button/Button';
import { useNavigate } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import GenericTable from '../../components/tables/GenericTable';
import { useModal } from '../../hooks/useModal';
import { Modal } from '../../components/ui/modal';
import Spinner from '../../components/spinner/Spinner';
import SomethingWentWrong from '../../components/SomethingWentWrong';
import { ApiClient } from '../../_utils/axios';
import { toast } from "react-toastify"

const headers = [
  {key: "id", value: "ID"},
  {key: "name", value: "Name"},
  {key: "description", value: "Description"},
  {key: "action", value: "Action"}
];

const BusinessType = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedID, setSelectedID] = useState(0);
  
  const { isOpen, openModal, closeModal } = useModal();

  const {isLoading, isError, data: result, error } = useQuery({
    queryKey: ["businessTypes"],
    queryFn: () => ApiClient.get("business-types").then((response) => response.data)
  });

  const deleteMutation = useMutation({ 
    mutationFn: ({id}) => ApiClient.delete(`business-types/${id || 0}`).then((response) => response.data),
    onSuccess: (data) => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["businessTypes"] });
      if(data.success){
        toast.success(data?.message, { position: "bottom-right" });
      } else {
        toast.error("Business Type Error!", { position: "bottom-right" });
      }
    }
  });

  if(isLoading) return <Spinner />;
  if(isError) return <SomethingWentWrong />;

  return (
    <>
        <PageMeta
        title="Business Type"
        description=""
    />
    <PageBreadcrumb pageTitle="Business Type" />
    <div className="space-y-6">
        <ComponentCard title="">
            <Button size="sm" variant="primary" onClick={() => {
                navigate("/business-type/create");
              }}>
              New Business Type
            </Button>
        <GenericTable columnHeaders={headers} tableData={result.data} 
          onEdit={(obj) => {
            navigate(`/business-type/update/${obj.id}`);
          }} 
          onDelete={(obj) => {
            setSelectedID(obj?.id);
            openModal();
          }} 
        />
        </ComponentCard>
    </div>

    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button size="sm" variant="danger" onClick={() => {
                if(selectedID > 0) deleteMutation.mutate({ id: selectedID});
              }}>
                Continue Delete?
              </Button>
            </div>
          </div>
        </div>
    </Modal>
    </>
  )
}

export default BusinessType