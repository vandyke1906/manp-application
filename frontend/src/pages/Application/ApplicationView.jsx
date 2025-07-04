import { useEffect, useRef, useState } from 'react'
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Button from '../../components/ui/button/Button';
import Badge from '../../components/ui/badge/Badge';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Spinner from '../../components/spinner/Spinner';
import SomethingWentWrong from '../../components/SomethingWentWrong';
import { ApiClient } from '../../_utils/axios';
import BasicTable from '../../components/tables/BasicTable';
import { formatDate, formatFileSize, getReadableStatus, hasRole, ROLES } from '../../_utils/helper';
import ApprovalModal from './ApprovalModal';
import DialogModal from  '../../components/ui/modal/DialogModal';
import { useModal } from '../../hooks/useModal';
import useUserStore from '../../_utils/store/useUserStore';

const documentsHeaders = [
  {key: "file_name", value: "File Name"},
  {key: "file_size", value: "File Size"},
  {key: "updated_at", value: "Date Modified"},
  {key: "action", value: "Action"}
];

const approvalHeaders = [
  {key: "full_name", value: "Approver"},
  {key: "comment", value: "Comment"},
  {key: "status", value: "Status"},
  {key: "approved_at", value: "Action Date"}
];

const getStatusBadge = (status) => {
  let color = "info";
  switch(status){
    case "pending": color = "primary"; break;
    case "approved": color = "success"; break;
    case "rejected": color = "error"; break;
    case "cancelled": color = "warning"; break;
    case "for_survey": color = "warning"; break;
  }
  return <Badge color={color}>
    {getReadableStatus(status)}
  </Badge>
};


const ApplicationView = ({title=""}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const formRef = useRef(null);
  const { user } = useUserStore();
  const [obj, setObj] = useState({});
  const [applicantTypes, setApplicantTypes] = useState([]);

  const { isOpen, openModal, closeModal } = useModal();
  const dialogModal = useModal();

  const { isLoading, isError, data: result, isSuccess, refetch } = useQuery({ 
    queryKey: ["application", id],
    queryFn: () => ApiClient.get(`applications/${id}`).then((response) => {
      return response.data;
    }),
    enabled: !!id,
  });
  
  const userProfileQuery = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => ApiClient.get(`/users/profile`).then((response) => response.data),
  });

  // Use useEffect to update the state when the query is successful
  useEffect(() => {
    if (isSuccess && result) {
      setObj(result?.data);
    }
  }, [isSuccess, result]);

  useEffect(() => {
  if (isError) {
    navigate("/applications");
  }
}, [isError, navigate]);


  const createMutation = useMutation({ 
    mutationFn: (data) => ApiClient.post("applications", data, { headers: {  'Content-Type': 'multipart/form-data' } }).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["application"] });
      if(data.success){
        formRef.current.reset();
        toast.success(data.message, { position: "bottom-right", onClose: (reason) => {
          if(!reason) navigate("/applications");
        } });
      } else {
        toast.error("Business Type Error!", { position: "bottom-right" });
      }
    }
  });

  // Mutation for updating
  const updateMutation = useMutation({
    mutationFn: (data) => ApiClient.put(`applications/${data?.id || 0}`, data, { headers: {  'Content-Type': 'multipart/form-data' } }).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["application"] });
      if(data.success){
        toast.success(data.message, {
          position: "bottom-right",
          onClose: (reason) => {
            if (!reason) navigate("/applications");
          },
        });
      } else {
        toast.error("Application Error!", { position: "bottom-right" });
      }
    },
  });


  // Mutation for updating application file
  const uploadFileMutation = useMutation({
    mutationFn: ({data, id}) => ApiClient.post(`application-files/${id || 0}`, data).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["application-file"] });
      if(data.success){
        toast.success(data.message, { position: "bottom-right" });
      } else {
        toast.error("Application file upload error!", { position: "bottom-right" });
      }
    },
  });


  //confirm submission of documents
  const confirmDocumenSubmission = useMutation({ 
    mutationFn: (id) => ApiClient.post(`/approvals/${id}/confirm-submission`).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["condirm-submission"] });
      if(data.success){
        refetch();
        toast.success(data.message, { position: "bottom-right", delay: 1500});
      } else {
        toast.error("Confim document submission error!", { position: "bottom-right" });
      }
      dialogModal.closeModal();
    }
  });


  const handleSave = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // Creates a FormData object from the form
    const data = Object.fromEntries(formData.entries()); // Converts FormData to
    data.applicant_type_id = applicantTypes;
    // Call the correct mutation based on whether an `id` exists
    if (id) {
      updateMutation.mutate({ id, ...data }); // Include `id` for the update call
    } else {
      createMutation.mutate(data);
    }
  };

  if(isLoading) return <Spinner />;
  if(isError) return <SomethingWentWrong />;

  return (
    <>
      <PageMeta title="View Application"  description=""/>
      <PageBreadcrumb pageTitle="Application" />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {obj?.business_name} ({obj?.application_number})
             &nbsp;&nbsp;
             {!!obj?.approvals?.length ? getStatusBadge(obj.approvals[0].status) : getStatusBadge("pending")}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button> */}
          {!hasRole(ROLES.PROPONENTS) && showApplicationActionButton({ isCurrentApprover: obj?.current_approver_role === user?.role, approvals:obj?.approvals, modal: dialogModal, openModal })}
        </div>
      </div>

      <ProponentInfoCard data={obj} />
      <BusinessProjectInfoCard data={obj} />
      <SubmittedDocumentsCard files={obj?.files || []} mutation={uploadFileMutation} />
      <ApprovalsCard data={obj?.approvals || []} />
    </div>

    <ApprovalModal closeModal={closeModal} isOpen={isOpen} application_id={id} />
    <DialogModal 
      isOpen={dialogModal.isOpen} 
      closeModal={dialogModal.closeModal} 
      title="Confirm Submission"
      description={`Click the "Confirm Submission" button once all required documents have been received and verified in the office. This action updates the approval status to "${getReadableStatus("in_review")}" and moves the application to the next stage for processing.`}
      onSumbit={() => confirmDocumenSubmission.mutate(id)}
    />
    
    </>
  )
}


const ProponentInfoCard = ({data = {}}) => {
 return (
  <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Proponent Information
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 xl:gap-x-36 2xl:gap-x-48">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.first_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Middle Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.middle_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.last_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Suffix
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.suffix}
              </p>
            </div>

            <div className="col-span-2">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Contact Number/s
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.contact_number}
              </p>
            </div>

            <div className="col-span-2">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.email_address}
              </p>
            </div>

            <div className="col-span-4">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.address}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
 );
};

const BusinessProjectInfoCard = ({data = {}}) => {

  const applicantTypesQuery = useQuery({
    queryKey: ["application-types"],
    queryFn: () => ApiClient.get(`/applicant-types/by-ids?ids=${data?.applicant_type_id.join(',')}`).then((response) => response.data),
    enabled: !!data?.applicant_type_id,
  });

  const applicationTypeQuery = useQuery({
    queryKey: ["application-type"],
    queryFn: () => ApiClient.get(`application-types/${data.application_type_id}`).then((response) => response.data),
    enabled: !!data?.application_type_id,
  });

  const businessTypeQuery = useQuery({
    queryKey: ["business-type"],
    queryFn: () => ApiClient.get(`business-types/${data.business_type_id}`).then((response) => response.data),
    enabled: !!data?.business_type_id,
  });

  const capitalizationQuery = useQuery({
    queryKey: ["capitalization"],
    queryFn: () => ApiClient.get(`capitalizations/${data.capitalization_id}`).then((response) => response.data),
    enabled: !!data?.capitalization_id,
  });

  const businessNatureQuery = useQuery({
    queryKey: ["business-nature"],
    queryFn: () => ApiClient.get(`business-natures/${data.business_nature_id}`).then((response) => response.data),
    enabled: !!data?.business_nature_id,
  });  

    const businessStatusQuery = useQuery({
    queryKey: ["business-status"],
    queryFn: () => ApiClient.get(`business-statuses/${data.business_status_id}`).then((response) => response.data),
    enabled: !!data?.business_status_id,
  });  

 return (
  <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Business or Project Information
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Application Number
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.application_number}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Application Type
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {applicationTypeQuery?.data?.data?.name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Type of Applicant
              </p>
              <div className="flex flex-wrap gap-4">
                {applicantTypesQuery?.data?.data?.map((obj) => (
                    <Badge key={obj.id} size="sm">{obj.name.toUpperCase()}</Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Application Date
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {formatDate(data.application_date, "MMMM dd, yyyy")}
              </p>
            </div>

            <div className="col-span-2">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Business Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.business_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nature of Business
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {businessNatureQuery?.data?.data?.name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Status of Business
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {businessStatusQuery?.data?.data?.name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Capitalization
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {capitalizationQuery?.data?.data?.name}
              </p>
            </div>

            <div className="col-span-2">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Business Address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
               {data.business_address}
              </p>
            </div>

            <div className="col-span-2">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Brief Description of the Business
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.business_description}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
 );
};

const SubmittedDocumentsCard = ({files = [], mutation}) => {
  const handleUploadClick = (mutation, name, fileId) => {
  const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';


    input.onchange = (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append(name, file);
      mutation.mutate({data: formData, id: fileId});
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  return (
    <ComponentCard title="Submitted Documents" className="my-6">
      <BasicTable
        columnHeaders={documentsHeaders}
        tableData={files.map((file) => ({
            ...file,
            file_size: formatFileSize(file.file_size),
            updated_at: formatDate(file.updated_at, "dd-MMM-yyyy hh:mm A")
        }))}
        onView={(obj) => {
          const width = 800;
          const height = 600;
          const left = (window.screen.width - width) / 2;
          const top = (window.screen.height - height) / 2;

          window.open(
            obj.uri,
            "_blank",
            `noopener,noreferrer,width=${width},height=${height},resizable=yes,left=${left},top=${top}`
          );
        }}
        onEdit={
          hasRole(ROLES.PROPONENTS)
            ? (obj) => handleUploadClick(mutation, obj.title, obj.file_id) : undefined
        }
      />
    </ComponentCard>
  );
};

const ApprovalsCard = ({data = {}}) => {
  return (
    <ComponentCard title="Approvals" className="my-6">
      <BasicTable
        columnHeaders={approvalHeaders}
        tableData={data.filter(o => !!o.user_id).map(obj => ({
          ...obj,
          full_name: obj.approver_name?.full_name || "",
          status: getStatusBadge(obj.status),
          approved_at: formatDate(obj.approved_at, "dd-MMM-yyyy hh:mm A")
        }))}/>
    </ComponentCard>
  );
}

const showApplicationActionButton = ({isCurrentApprover, approvals = [], modal, openModal}) => {
  console.info({approvals, isCurrentApprover});
  if(!approvals.length)
    return <Button onClick={() => modal?.openModal()}>Confirm Submission</Button>;
  else if(isCurrentApprover && !approvals.some((a) => a.status === "completed"))
    return <Button onClick={openModal}>Take Action</Button>;
  else
    return null;
}

export default ApplicationView