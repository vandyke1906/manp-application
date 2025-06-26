import React, { useRef, useState } from 'react'
import { Modal } from '../../components/ui/modal';
import Button from '../../components/ui/button/Button';
import Label from '../../components/form/Label';
import Select from '../../components/form/Select';
import TextArea from '../../components/form/input/TextArea';
import DatePicker from '../../components/form/DatePicker';
import { STATUS } from '../../_utils/helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '../../_utils/axios';

const ApprovalModal = ({closeModal = () => {}, isOpen = false, application_id = 0}) => {
  const formRef = useRef(null);
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("pending");

  const createMutation = useMutation({ 
    mutationFn: (data) => ApiClient.post("approvals", data).then((response) => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["approval"] });
      if(data.success){
        formRef.current.reset();
        closeModal();
        queryClient.invalidateQueries({ queryKey: ["application", application_id] });
        toast.success(data.message, { position: "bottom-right" });
      } else {
        toast.error("Approval Error!", { position: "bottom-right" });
      }
    }
  });

  const handleSave = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // Creates a FormData object from the form
    const data = Object.fromEntries(formData.entries()); // Converts FormData to
    data.application_id = application_id;
    
    createMutation.mutate(data);
    // if (id) {
    //   updateMutation.mutate({ id, ...data }); // Include `id` for the update call
    // } else {
    //   createMutation.mutate(data);
    // }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
      <form ref={formRef} onSubmit={handleSave}>
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 px-2">
            <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Approval Action
            </h4>
            <div>
                <Label htmlFor="status">Status</Label>
                 <Select
                  options={Object.entries(STATUS).map(([value, label]) => ({ value, label })).filter(s => !["pending", "cancelled", "in_review"].includes(s.value))}
                  name="status"
                  placeholder="Select Status"
                  className="dark:bg-dark-900"
                  isRequired={true}
                  onChange={(value) => setStatus(value)}
                />
            </div>
            {status == "for_survey" && <div>
                 <DatePicker
                    id="survey_date"
                    name="survey_date"
                    label="Survey Date"
                    placeholder="Select a date"
                    // defaultDate={obj?.application_date || ""}
                    // hint={objFormError?.application_date?.join(", ") ?? ""}
                    // error={!!objFormError?.application_date}
                  />
            </div>}
            <div>
                <Label htmlFor="comment">Comment</Label>
                <TextArea id="comment" rows={12} name="comment" placeholder="comment" />
            </div>

            <div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>Cancel</Button>
                <Button size="sm" type="submit" variant="primary">Save Action</Button>
              </div>
            </div>

          </div>
        </div>
        </form>
    </Modal>
  )
}

export default ApprovalModal
