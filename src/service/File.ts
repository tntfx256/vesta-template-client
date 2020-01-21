export function browse(multiple = false, types?: string[]): Promise<File | File[]> {
    let filesList: File | File[] = multiple ? [] : null;
    const fileInput: HTMLInputElement = document.createElement("input");
    fileInput.setAttribute("type", "file");
    if (types && types.length) {
        fileInput.setAttribute("accept", types.join(", "));
    }
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);
    fileInput.click();
    return new Promise((resolve, reject) => {
        fileInput.onchange = function(event) {
            if (multiple) {
                for (let i = 0, il = (this as any).files.length; i < il; i++) {
                    (filesList as File[]).push((this as any).files[i]);
                }
            } else {
                filesList = (this as any).files[0];
            }
            document.body.removeChild(fileInput);
            resolve(filesList);
        };
    });
}
