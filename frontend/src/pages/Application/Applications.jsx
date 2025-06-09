import React, { useState } from 'react'
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Button from '../../components/ui/button/Button';
import { useNavigate  } from "react-router";
import GenericTable from '../../components/tables/GenericTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useModal } from '../../hooks/useModal';
import { Modal } from '../../components/ui/modal';
import Spinner from '../../components/spinner/Spinner';
import SomethingWentWrong from '../../components/SomethingWentWrong';
import { ApiClient } from '../../_utils/axios';
import { formatDate, getReadableStatus, hasRole, ROLES } from '../../_utils/helper';

const headers = [
  {key: "application_number", value: "Application Number"},
  {key: "application_date", value: "Application Date"},
  {key: "business_name", value: "Business Name"},
  {key: "business_address", value: "Business Address"},
  {key: "status", value: "Application Status"},
  {key: "action", value: "Action"}
];

const Applications = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedID, setSelectedID] = useState(0);
  
  const { isOpen, openModal, closeModal } = useModal();

  const {isLoading, isError, data: result = { data: [] }, error } = useQuery({
    queryKey: ["applications"],
    queryFn: () => ApiClient.get("applications").then((response) => response.data),
  });

  const deleteMutation = useMutation({ 
    mutationFn: ({id}) => ApiClient.delete(`applications/${id || 0}`).then((response) => response.data),
    onSuccess: (data) => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      if(data.success){
        toast.success(data.messaage, { position: "bottom-right", autoClose: 3000, onClose: (reason) => {
        } });
      } else {
        toast.error("Application Type Error!", { position: "bottom-right" });
      }
    }
  });

  if(isLoading) return <Spinner />;
  if(isError) return <SomethingWentWrong />;

  return (
    <>
        <PageMeta
        title="Applications"
        description=""
    />
    <PageBreadcrumb pageTitle="Applications" />
    <div className="space-y-6">
        <ComponentCard title="">
          <div className="space-y-5 sm:space-y-6">
              {/* {hasRole(ROLES.PROPONENTS) && <Button size="sm" variant="primary" onClick={() => { navigate("/application-form") }}>New Application</Button>} */}
              <Button size="sm" variant="primary" onClick={() => { navigate("/application-form") }}>New Application</Button>
              
              <GenericTable 
                  columnHeaders={headers} 
                  tableData={result.data.map(data => ({
                    ...data,
                    application_date: formatDate(data.application_date, "dd-MMM-yyyy hh:mm A"),
                    status: getReadableStatus(data.approvals?.[0]?.status)
                }))}
                onEdit={hasRole(ROLES.PROPONENTS) && result.data?.approvals?.some(obj => obj.status !== "completed") 
                  ? (obj) => navigate(`/application-form/${obj.id}`) 
                  : undefined} 
                onDelete={hasRole(ROLES.PROPONENTS) && result.data?.approvals?.some(obj => obj.status !== "completed") 
                  ? (obj) => {
                      setSelectedID(obj?.id);
                      openModal();
                    }
                  : undefined} 
                onView={(obj) => navigate(`/application-view/${obj.id}`)}
              />

          </div>
        </ComponentCard>
    </div>

    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Delete?
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Continue delete selected application?
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

export default Applications