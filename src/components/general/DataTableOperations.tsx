import { IAccess, IComponentProps, Icon, MessageBox, MessageBoxBtn, MessageBoxBtnGroup } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { MouseEvent, PureComponent } from "react";
import { Link } from "react-router-dom";

interface IDataTableOperationsProps extends IComponentProps {
    access: IAccess;
    id: number;
    path: string;
    onDelete?: (id: number) => void;
}

interface IDataTableOperationsState {
    showConfirmBox: boolean;
}

export class DataTableOperations extends PureComponent<IDataTableOperationsProps, IDataTableOperationsState> {

    private tr = Culture.getDictionary().translate;

    constructor(props: IDataTableOperationsProps) {
        super(props);
        this.state = { showConfirmBox: false };
    }

    public render() {
        const { path, id, access, children } = this.props;
        const { showConfirmBox } = this.state;
        const editLink = access.edit ?
            <Link to={`/${path}/edit/${id}`} className="edit-btn"><Icon name="mode_edit" /></Link> : null;
        const delLink = access.delete ?
            <span className="del-btn" onClick={this.onDelete}><Icon name="delete" /></span> : null;

        return (
            <span className="data-table-operations dt-operation-cell">
                <Link to={`/${path}/detail/${id}`}><Icon name="search" /></Link>
                {editLink}
                {delLink}
                {children}
                <MessageBox show={showConfirmBox} btnGroup={MessageBoxBtnGroup.YesNo} onAction={this.onAction}
                    title={this.tr("title_record_delete")}>
                    <p>{this.tr("msg_delete_confirm")}</p>
                </MessageBox>
            </span>
        );
    }

    private onDelete = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        this.setState({ showConfirmBox: true });
    }

    private onAction = (btn: MessageBoxBtn) => {
        this.setState({ showConfirmBox: false });
        if (btn === MessageBoxBtn.Yes && this.props.onDelete) {
            this.props.onDelete(this.props.id);
        }
    }
}
