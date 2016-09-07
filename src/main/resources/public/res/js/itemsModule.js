$(document).ready(function () {
    var itemsController = (function () {
        var urlBase = "api/items";
        var itemsTableBody = $("#items-table-body");
        var createItemForm = $("#create-item-form");
        var selectedItemId;
        var itemTemplate = function (id, name, description) {
            return "" +
                "<tr>" +
                "   <td>" + name + "</td>" +
                "   <td>" +
                "       <button class=\"btn btn-info pull-right view-item-btn\" data-item-id=\"" + id + "\">" +
                "           view" +
                "       </button>" +
                "   </td>" +
                "   <td>" +
                "       <button class=\"btn btn-success pull-right update-item-btn\" data-item-id=\"" + id + "\">" +
                "           update" +
                "       </button>" +
                "   </td>" +
                "   <td>" +
                "       <button class=\"btn btn-warning pull-right delete-item-btn\" data-item-id=\"" + id + "\">" +
                "           delete" +
                "       </button>" +
                "   </td>" +
                "</tr>";
        };

        var init = function () {
            reloadItems();
            bindForms();
            bindButtons();
        };
        var bindForms = function () {
            createItemForm.submit(function (e) {
                e.preventDefault();
                saveItem();
            });
        };
        var bindButtons = function () {
            itemsTableBody.on('click', '.view-item-btn', function () {
                selectItem($(this).data('item-id'), 'view');
            });
            itemsTableBody.on('click', '.update-item-btn', function () {
                selectItem($(this).data('item-id'), 'update');
            });
            itemsTableBody.on('click', '.delete-item-btn', function () {
                selectItem($(this).data('item-id'), 'delete');
            });

            $("#confirm-item-deletion").click(function () {
                $("#deleteItemModal").modal('hide');
                deleteItem(selectedItemId);
            });
        };
        var selectItem = function (itemId, action) {
            var apiUrl = urlBase + "/" + itemId;
            $.get(apiUrl, function (item) {
                if (item) {
                    selectedItemId = item.id;
                    switch(action) {
                        case 'view':
                            $("#viewItemModal").modal('show');
                            break;
                        case 'update':
                            $("#updateItemModal").modal('show');
                            break;
                        case 'delete':
                            $("#deleteItemModal").modal('show');
                            break;
                    }
                }
            });
        };
        var reloadItems = function () {
            $.get(urlBase, function (data) {
                itemsTableBody.empty();
                $.each(data, function (i, item) {
                    itemsTableBody.append(itemTemplate(item.id, item.name, item.description));
                })
            });
        };
        var saveItem = function () {
            var newItemName = $("#new-item-name");
            var newItemDescription = $("#new-item-description");
            var createItemData = JSON.stringify({
                name: newItemName.val(),
                description: newItemDescription.val()
            });
            $.ajax({
                type: "POST",
                url: urlBase,
                data: createItemData,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    newItemName.val("");
                    newItemDescription.val("");
                    reloadItems();
                }
            });
        };
        return {
            init: init
        }
    })();
    itemsController.init();
});
