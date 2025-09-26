import Swal, { SweetAlertIcon } from 'sweetalert2';

const titlesDefaults: Record<SweetAlertIcon, string> = {
    success: "Successful operation!",
    error: "Something went wrong!",
    warning: "Warning!",
    info: "Hey, check this out!",
    question: "Are you sure?",
};

interface AlertOptions {
    title?: string;
    description?: string;
    icon?: SweetAlertIcon;
    preConfirm?: () => Promise<any>;
}

export class CustomAlert {

    static toast(type: SweetAlertIcon = 'success', title: string = titlesDefaults[type]) {
        Swal.mixin({
            icon: type,
            title: title,
            toast: true,
            position: "top-right",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: {
                title: "text-2xl font-medium leading-snug",
                popup: "rounded-xl",
            },
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        }).fire();
    }

    static alert(type: SweetAlertIcon = "success", options?: AlertOptions) {
        const title = options?.title || titlesDefaults[type];
        const description = options?.description || undefined;
        Swal.fire({
            icon: type,
            title: title,
            text: description,
            customClass: {
                title: "text-2xl font-medium",
                confirmButton: "btn bg-gray-600 text-white hover:bg-gray-700",
                popup: "rounded-xl",
            },
            showCloseButton: true,
            showConfirmButton: true,
        });
    }

    static confirm(options?: AlertOptions) {
        const title = options?.title || "Confirm operation";
        const description = options?.description || undefined;
        const icon = options?.icon || 'question';
        const preConfirm = options?.preConfirm;

        return Swal.fire({
            title: title,
            text: description,
            icon: icon,
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            showLoaderOnConfirm: !!preConfirm,
            preConfirm: preConfirm,
            allowOutsideClick: () => !Swal.isLoading(),
            customClass: {
                title: "text-2xl font-medium mb-3",
                icon: "text-sm",
                htmlContainer: "mb-3 py-0",
                confirmButton: "btn bg-green-600 text-white hover:bg-green-700",
                cancelButton: "btn bg-gray-600 text-white hover:bg-gray-700",
                popup: "rounded-xl p-3",
                actions: "mt-0",
            },
            willOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                if (confirmButton) {
                    confirmButton.focus();
                }
            },
        });
    }
}