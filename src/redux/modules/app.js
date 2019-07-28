const apiUrls = {
  topstories: 'https://hacker-news.firebaseio.com/v0/topstories.json',
  beststories: 'https://hacker-news.firebaseio.com/v0/beststories.json',
  newstories: 'https://hacker-news.firebaseio.com/v0/newstories.json',
};
const itemUrl = 'https://hacker-news.firebaseio.com/v0/item/';


/** Initial state */
const initialState = {
  category: 'topstories',
  page: [],
  items: [],
  loading: false,
  error: null,
  currentPage: 0,
  itemsPerPage: 20,
};


/** Actions */
const FETCH_PAGE_BEGIN = 'app/FETCH_PAGE_BEGIN';
const FETCH_PAGE_SUCCESS = 'app/FETCH_PAGE_SUCCESS';
const FETCH_PAGE_FAILURE = 'app/FETCH_PAGE_FAILURE';
const FETCH_ITEM_SUCCESS = 'app/FETCH_ITEM_SUCCESS';
const FETCH_ITEM_FAILURE = 'app/FETCH_ITEM_FAILURE';
const CLEAR_ITEMS = 'app/CLEAR_ITEMS';
const CHANGE_CATEGORY = 'app/CHANGE_CATEGORY';
const NEXT_PAGE = 'app/NEXT_PAGE';
const PREVIOUS_PAGE = 'app/PREVIOUS_PAGE';


/** Action creators */
export function fetchPageBegin() {
  return { type: FETCH_PAGE_BEGIN };
}

export function fetchPageSuccess(data) {
  return {
    type: FETCH_PAGE_SUCCESS,
    payload: { data }
  };
}

export function fetchPageFailure(error) {
  return {
    type: FETCH_PAGE_FAILURE,
    payload: { error },
  };
}

export function fetchItemSuccess(data) {
  return {
    type: FETCH_ITEM_SUCCESS,
    item: {
      id: data.id,
      data,
    },
  };
}

export function fetchItemFailure(error) {
  return {
    type: FETCH_ITEM_FAILURE,
    payload: { error },
  };
}

export function clearItems() {
  return { type: CLEAR_ITEMS };
}

export function changeCategory(value) {
  return { type: CHANGE_CATEGORY, value };
}

export function nextPage(value) {
  return { type: NEXT_PAGE, value };
}

export function previousPage(value) {
  return { type: PREVIOUS_PAGE, value };
}


/** Reducer */
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_PAGE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_PAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        page: action.payload.data,
      };
    case FETCH_PAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        page: [],
      };
    case FETCH_ITEM_SUCCESS:
      return {
        ...state,
        itemError: null,
        items: [
          ...state.items,
          action.item.data,
        ],
      };
    case FETCH_ITEM_FAILURE:
      return {
        ...state,
        itemError: action.payload.error,
      };
    case CLEAR_ITEMS:
      return {
        ...state,
        items: [],
      };
    case CHANGE_CATEGORY:
      return {
        ...state,
        category: action.value,
      };
    case NEXT_PAGE:
      return {
        ...state,
        currentPage: state.currentPage + 1,
      };
    case PREVIOUS_PAGE:
      return {
        ...state,
        currentPage: state.currentPage - 1,
      };
    default:
      return state;
  }
}


/** Side effects */
export function fetchPage(type = initialState.category,
                          currentPage = initialState.currentPage,
                          itemsPerPage = initialState.itemsPerPage) {
  return dispatch => {
    dispatch(fetchPageBegin());
    return fetch(apiUrls[type])
      .then(res => res.json())
      .then(json => {
        const start = currentPage * itemsPerPage;
        const stop = (currentPage + 1) * itemsPerPage;
        const items = json.slice(start, stop);
        for (let item of items) {
          const url = `${itemUrl}${item}.json`;
          fetch(url)
            .then(res => res.json())
            .then(json => dispatch(fetchItemSuccess(json)))
            .catch(error => dispatch(fetchItemFailure(error)));
        }
        return json;
      })
      .then(json => dispatch(fetchPageSuccess(json)))
      .catch(error => dispatch(fetchPageFailure(error)));
  };
}
