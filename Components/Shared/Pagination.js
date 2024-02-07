import { LeftOutlined, RightOutlined, DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";

const Pagination = ({ noOfPages, currentPage, setCurrentPage }) => {
    const maxVisiblePages = 5;

    const incrementPage = (incrementBy) => {
        if (currentPage + incrementBy <= noOfPages) {
            setCurrentPage(currentPage + incrementBy);
        }
    };

    const decrementPage = (decrementBy) => {
        if (currentPage - decrementBy >= 1) {
            setCurrentPage(currentPage - decrementBy);
        }
    };

    const renderPageNumbers = () => {
        const totalPages = Math.min(maxVisiblePages, noOfPages);
        const middlePage = Math.ceil(maxVisiblePages / 2);
        const firstPage = Math.max(1, currentPage - middlePage + 1);
        const lastPage = Math.min(noOfPages, firstPage + totalPages - 1);

        return Array.from({ length: lastPage - firstPage + 1 }, (_, index) => firstPage + index).map((pageNo) => (
            <li key={pageNo}>
                <button
                 className={`${currentPage === pageNo ? "active bg-dark mx-1 rounded text-white" : "text-dark mx-1 bg-light rounded"}`}
                onClick={() => setCurrentPage(pageNo)}>{pageNo}</button>
            </li>
        ));
    };

    const renderDots = () => {
        if (noOfPages > maxVisiblePages) {
            return <li className="mx-2 text-dark">...</li>;
        }
        return null;
    };

    const isLastPage = currentPage === noOfPages;

    return (
        <nav className="px-2">
            <ul className="d-flex flex-row justify-content-center items-center px-2" style={{ listStyle: "none" }}>
                <li className="mx-2 text-dark" style={{cursor:"pointer"}} onClick={()=>setCurrentPage(1)}>
                    First
                </li>
                <li className="mx-2">
                    <DoubleLeftOutlined onClick={() => decrementPage(5)} />
                </li>
                <li className="mx-2">
                    <LeftOutlined onClick={() => decrementPage(1)} />
                </li>
                {renderPageNumbers()}
                {renderDots()}
                <li className={`mx-2 ${isLastPage ? 'disabled' : ''}`}>
                    <RightOutlined onClick={() => incrementPage(1)} disabled={isLastPage} />
                </li>
                <li className={`mx-2 ${isLastPage ? 'disabled ' : ''}`}>
                    <DoubleRightOutlined onClick={() => incrementPage(5)} disabled={isLastPage} />
                </li>
                <li className="mx-2 text-dark" style={{cursor:"pointer"}} onClick={()=>setCurrentPage(noOfPages)}>
                    Last
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
