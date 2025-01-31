import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { PurchaseForm } from './PurchaseForm';
import { Purchase, useGetPurchasesQuery } from '../purchasesApi';
import { PurchaseListItem } from './PurchaseListItem';
import { getErrorMessage } from '../../../commons/api/getErrorMessage';

const PurchasesList = () => {
  const [purchases, setPurchases] = useState<Purchase[]>()
  const [page, _] = useState(1)
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)

  const getPurchases = useGetPurchasesQuery({
    page
  })
  const purchasesPageInfo = getPurchases.data
  const purchasesPageData = purchasesPageInfo?.data

  useEffect(() => {
    if (purchasesPageData) {
      setPurchases(purchasesPageData)
    }
  }, [purchasesPageData])

  function renderList() {
    if (purchases?.length == 0) {
      return "No se encontraron resultados"
    }
    return <div className="space-y-4">
      {
        purchases?.map((item) => {
          console.log(item)
          return <PurchaseListItem
            key={item.id}
            item={item}
            isExpanded={expandedItemId === item.id}
            onClick={() => setExpandedItemId(item.id === expandedItemId ? null : item.id)}
          />
        }) || (getPurchases.isFetching && Array.from({ length: 15 }, (_, index) => <PurchaseListItem.Skeleton
          key={index}
        />))
      }
    </div>
  }

  function renderError() {
    return getPurchases.isError && (
      <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
        {getErrorMessage(getPurchases.error)}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#171717]">Ventas a Crédito</h1>
        <button
          onClick={() => setShowPurchaseForm(true)}
          className="z-999 fixed bottom-6 right-6 bg-[#171717] text-white p-4 rounded-full shadow-xl hover:scale-105 transition-transform"
        >
          <FaPlus className="w-6 h-6" />
        </button>
      </div>
      {renderError()}
      {renderList()}
      {showPurchaseForm && <PurchaseForm onClose={() => setShowPurchaseForm(false)} />}
    </div>
  );
};

export default PurchasesList;